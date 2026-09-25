import { PipelineStage,Types } from "mongoose";

import { MoodBoard } from "./moodboard.model";
import { Project } from "../projects/project.model";
import { Quotation } from "../quotations/models/quotation.model";
import { ApiError } from "../../utils/ApiError";
import { createNotificationService } from "../notifications/notification.service";



interface MoodBoardFileInput {
  url: string;
  publicId: string;
  fileName: string;
  fileType: "image" | "pdf";
}

interface CreateMoodBoardInput {
  projectId: string;
  designerId: string;
  files: MoodBoardFileInput[];
  designerNotes?: string;
}

interface AddMoodBoardVersionInput {
  projectId: string;
  designerId: string;
  files: MoodBoardFileInput[];
  designerNotes?: string;
}

interface RequestMoodBoardChangesInput {
  projectId: string;
  clientId: string;
  clientFeedback: string;
  clientReferenceImages?: string[];
}

interface ApproveMoodBoardInput {
  projectId: string;
  clientId: string;
}

interface GetMoodBoardsInput {
  userId: string;
  role: "designer" | "client";
  page?: number;
  limit?: number;
  search?: string;
}

const getPagination = (
  page = 1,
  limit = 10
) => {
  const currentPage = Math.max(
    1,
    Number(page)
  );

  const perPage = Math.min(
    50,
    Math.max(1, Number(limit))
  );

  return {
    page: currentPage,
    limit: perPage,
    skip:
      (currentPage - 1) * perPage,
  };
};

const getLatestVersion = (
  moodBoard: {
    versions: {
      versionNumber: number;
      status:
        | "draft"
        | "submitted"
        | "changes_requested"
        | "approved";
      clientFeedback?: string;
      clientReferenceImages?: string[];
    }[];
  }
) => {
  if (
    !moodBoard.versions ||
    moodBoard.versions.length === 0
  ) {
    throw new ApiError(
      404,
      "No Mood Board version found"
    );
  }

  return moodBoard.versions[
    moodBoard.versions.length - 1
  ];
};

const checkProjectId = (
  projectId: string
) => {
  if (!Types.ObjectId.isValid(projectId)) {
    throw new ApiError(
      400,
      "Invalid project ID"
    );
  }
};

export const createMoodBoardService =
  async ({
    projectId,
    designerId,
    files,
    designerNotes,
  }: CreateMoodBoardInput) => {
    checkProjectId(projectId);

    if (!files || files.length === 0) {
      throw new ApiError(
        400,
        "At least one design file is required"
      );
    }

    const project =
      await Project.findById(projectId);

    if (!project) {
      throw new ApiError(
        404,
        "Project not found"
      );
    }

    if (
      !project.designer ||
      project.designer.toString() !==
        designerId
    ) {
      throw new ApiError(
        403,
        "Only the assigned designer can create the Mood Board"
      );
    }

    if (
      project.designerStatus !==
      "accepted"
    ) {
      throw new ApiError(
        400,
        "Designer assignment must be accepted before creating a Mood Board"
      );
    }

    const quotation =
      await Quotation.findOne({
        project: projectId,
        status: "client_accepted",
      });

    if (!quotation) {
      throw new ApiError(
        400,
        "Mood Board can only be created after the client accepts the quotation"
      );
    }

    const existingMoodBoard =
      await MoodBoard.findOne({
        project: projectId,
      });

    if (existingMoodBoard) {
      throw new ApiError(
        400,
        "Mood Board already exists for this project"
      );
    }

    const moodBoard =
      await MoodBoard.create({
        project: project._id,
        client: project.client,
        designer: project.designer,
        status: "draft",
        versions: [
          {
            versionNumber: 1,
            files,
            designerNotes,
            status: "draft",
          },
        ],
      });

    return moodBoard;
  };


export const addMoodBoardVersionService =
  async ({
    projectId,
    designerId,
    files,
    designerNotes,
  }: AddMoodBoardVersionInput) => {
    checkProjectId(projectId);

    if (!files || files.length === 0) {
      throw new ApiError(
        400,
        "At least one design file is required"
      );
    }

    const moodBoard =
      await MoodBoard.findOne({
        project: projectId,
      });

    if (!moodBoard) {
      throw new ApiError(
        404,
        "Mood Board not found"
      );
    }

    if (
      moodBoard.designer.toString() !==
      designerId
    ) {
      throw new ApiError(
        403,
        "Only the assigned designer can add a Mood Board version"
      );
    }

    if (moodBoard.status === "approved") {
      throw new ApiError(
        400,
        "This Mood Board has already been approved"
      );
    }

    const latestVersion =
      getLatestVersion(moodBoard);

    if (
      latestVersion.status !==
      "changes_requested"
    ) {
      throw new ApiError(
        400,
        "A new version can only be created after the client requests changes"
      );
    }

    const nextVersionNumber =
      latestVersion.versionNumber + 1;

    moodBoard.versions.push({
      versionNumber:
        nextVersionNumber,
      files,
      designerNotes,
      status: "draft",
    });

    moodBoard.status = "draft";

    await moodBoard.save();

    return moodBoard;
  };

export const submitMoodBoardService =
  async ({
    projectId,
    designerId,
  }: {
    projectId: string;
    designerId: string;
  }) => {
    checkProjectId(projectId);

    const moodBoard =
      await MoodBoard.findOne({
        project: projectId,
      });

    if (!moodBoard) {
      throw new ApiError(
        404,
        "Mood Board not found"
      );
    }

    if (
      moodBoard.designer.toString() !==
      designerId
    ) {
      throw new ApiError(
        403,
        "Only the assigned designer can submit the Mood Board"
      );
    }

    const latestVersion =
      getLatestVersion(moodBoard);

    if (latestVersion.status !== "draft") {
      throw new ApiError(
        400,
        "Only a draft version can be submitted"
      );
    }

    latestVersion.status = "submitted";
moodBoard.status = "submitted";

await moodBoard.save();

await createNotificationService({
  recipient: moodBoard.client,
  type: "MOOD_BOARD_SUBMITTED",
  title: "Mood Board Ready for Review",
  message:
    "A new Mood Board has been submitted for your project.",
  project: moodBoard.project,
  link: `/client/moodbaords/${moodBoard.project}`,
});

return moodBoard;
  };


export const requestMoodBoardChangesService =
  async ({
    projectId,
    clientId,
    clientFeedback,
    clientReferenceImages = [],
  }: RequestMoodBoardChangesInput) => {
    checkProjectId(projectId);

    const moodBoard =
      await MoodBoard.findOne({
        project: projectId,
      });

    if (!moodBoard) {
      throw new ApiError(
        404,
        "Mood Board not found"
      );
    }

    if (
      moodBoard.client.toString() !==
      clientId
    ) {
      throw new ApiError(
        403,
        "You are not allowed to review this Mood Board"
      );
    }

    const latestVersion =
      getLatestVersion(moodBoard);

    if (
      latestVersion.status !==
      "submitted"
    ) {
      throw new ApiError(
        400,
        "Only a submitted Mood Board can receive change requests"
      );
    }

    if (!clientFeedback.trim()) {
      throw new ApiError(
        400,
        "Change description is required"
      );
    }

    latestVersion.status =
      "changes_requested";

    latestVersion.clientFeedback =
      clientFeedback.trim();

    latestVersion.clientReferenceImages =
      clientReferenceImages;

    moodBoard.status =
      "changes_requested";

    await moodBoard.save();

await createNotificationService({
  recipient: moodBoard.designer,
  type: "MOOD_BOARD_CHANGES_REQUESTED",
  title: "Mood Board Changes Requested",
  message: `The client requested changes to the Mood Board. Feedback: ${clientFeedback.trim()}`,
  project: moodBoard.project,
  link: `/designer/moodboards/${moodBoard.project}`,
});

    return moodBoard;
  };

export const approveMoodBoardService =
  async ({
    projectId,
    clientId,
  }: ApproveMoodBoardInput) => {
    checkProjectId(projectId);

    const moodBoard =
      await MoodBoard.findOne({
        project: projectId,
      });

    if (!moodBoard) {
      throw new ApiError(
        404,
        "Mood Board not found"
      );
    }

    if (
      moodBoard.client.toString() !==
      clientId
    ) {
      throw new ApiError(
        403,
        "You are not allowed to approve this Mood Board"
      );
    }

    const latestVersion =
      getLatestVersion(moodBoard);

    if (
      latestVersion.status !==
      "submitted"
    ) {
      throw new ApiError(
        400,
        "Only a submitted Mood Board can be approved"
      );
    }

    latestVersion.status = "approved";

    moodBoard.status = "approved";

    await moodBoard.save();
    await Project.findByIdAndUpdate(
  projectId,
  {
    status: "in_progress",
  },
  { new: true }
);

await createNotificationService({
  recipient: moodBoard.designer,
  type: "MOOD_BOARD_APPROVED",
  title: "Mood Board Approved",
  message: "The client has approved the Mood Board.",
  project: moodBoard.project,
  link: `/designer/moodboards/${moodBoard.project}`,
});

    return moodBoard;
  };


export const getDesignerMoodBoardsService =
  async ({
    userId,
    page = 1,
    limit = 10,
    search = "",
  }: GetMoodBoardsInput) => {
    const pagination = getPagination(
      page,
      limit
    );

    const searchRegex = search.trim()
      ? new RegExp(
          search.trim(),
          "i"
        )
      : null;

    const matchStage: Record<
      string,
      unknown
    > = {
      designer:
        new Types.ObjectId(userId),
      designerStatus: "accepted",
    };

    const pipeline: PipelineStage[] = [
      {
        $match: matchStage,
      },

      {
        $lookup: {
          from: "users",
          localField: "client",
          foreignField: "_id",
          as: "client",
        },
      },

      {
        $unwind: {
          path: "$client",
          preserveNullAndEmptyArrays:
            true,
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "designer",
          foreignField: "_id",
          as: "designer",
        },
      },

      {
        $unwind: {
          path: "$designer",
          preserveNullAndEmptyArrays:
            true,
        },
      },

      {
        $lookup: {
          from: "moodboards",
          localField: "_id",
          foreignField: "project",
          as: "moodBoard",
        },
      },

      {
        $unwind: {
          path: "$moodBoard",
          preserveNullAndEmptyArrays:
            true,
        },
      },
    ];

    if (searchRegex) {
      pipeline.push({
        $match: {
          $or: [
            {
              "client.fullName":
                searchRegex,
            },
            {
              "client.email":
                searchRegex,
            },
          ],
        },
      });
    }

    pipeline.push(
      {
        $sort: {
          updatedAt: -1,
        },
      },

      {
        $facet: {
          data: [
            {
              $skip: pagination.skip,
            },

            {
              $limit: pagination.limit,
            },

            {
              $project: {
                _id: 1,

                project: {
                  _id: "$_id",
                  status: "$status",
                  designerStatus:
                    "$designerStatus",
                  sourceRequest:
                    "$sourceRequest",
                },

                client: {
                  _id: "$client._id",
                  fullName:
                    "$client.fullName",
                  email:
                    "$client.email",
                  phone:
                    "$client.phone",
                },

                designer: {
                  _id: "$designer._id",
                  fullName:
                    "$designer.fullName",
                  email:
                    "$designer.email",
                },

                moodBoard: {
                  $cond: [
                    {
                      $ifNull: [
                        "$moodBoard._id",
                        false,
                      ],
                    },

                    {
                      _id:
                        "$moodBoard._id",
                      status:
                        "$moodBoard.status",
                      versions:
                        "$moodBoard.versions",
                      createdAt:
                        "$moodBoard.createdAt",
                      updatedAt:
                        "$moodBoard.updatedAt",
                    },

                    null,
                  ],
                },

                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],

          total: [
            {
              $count: "count",
            },
          ],
        },
      }
    );

    const result =
      await Project.aggregate(
        pipeline
      );

    const data =
      result[0]?.data ?? [];

    const total =
      result[0]?.total?.[0]
        ?.count ?? 0;

    return {
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(
          total / pagination.limit
        ),
      },
    };
  };

export const getDesignerMoodBoardService =
  async ({
    projectId,
    designerId,
  }: {
    projectId: string;
    designerId: string;
  }) => {
    checkProjectId(projectId);

    const moodBoard =
      await MoodBoard.findOne({
        project: projectId,
        designer: designerId,
      })
        .populate(
          "project",
          "status designerStatus sourceRequest"
        )
        .populate(
          "client",
          "fullName email phone"
        )
        .populate(
          "designer",
          "fullName email"
        );

    return moodBoard;
  };

export const getAdminMoodBoardService =
  async (projectId: string) => {
    checkProjectId(projectId);

    const moodBoard =
      await MoodBoard.findOne({
        project: projectId,
      })
        .populate(
          "project",
          "projectName status designerStatus sourceRequest"
        )
        .populate(
          "client",
          "fullName email phone"
        )
        .populate(
          "designer",
          "fullName email"
        );

    return moodBoard;
  };

export const getClientMoodBoardService =
  async ({
    projectId,
    clientId,
  }: {
    projectId: string;
    clientId: string;
  }) => {
    checkProjectId(projectId);

    const moodBoard =
      await MoodBoard.findOne({
        project: projectId,
        client: clientId,
      })
        .populate(
          "project",
          "status designerStatus"
        )
        .populate(
          "designer",
          "fullName email"
        );

    if (!moodBoard) {
      throw new ApiError(
        404,
        "Mood Board not found"
      );
    }

    const latestVersion =
      getLatestVersion(moodBoard);

    return {
      _id: moodBoard._id,
      project: moodBoard.project,
      designer: moodBoard.designer,
      status: moodBoard.status,
      currentVersion: latestVersion,
      createdAt:
        moodBoard.createdAt,
      updatedAt:
        moodBoard.updatedAt,
    };
  };

export const getClientMoodBoardsService =
  async ({
    userId,
    page = 1,
    limit = 10,
    search = "",
  }: GetMoodBoardsInput) => {
    const pagination = getPagination(
      page,
      limit
    );

    const searchRegex = search.trim()
      ? new RegExp(
          search.trim(),
          "i"
        )
      : null;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          client:
            new Types.ObjectId(userId),
        },
      },

      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "project",
        },
      },

      {
        $unwind: "$project",
      },

      {
        $lookup: {
          from: "users",
          localField: "designer",
          foreignField: "_id",
          as: "designer",
        },
      },

      {
        $unwind: "$designer",
      },
    ];

    if (searchRegex) {
      pipeline.push({
        $match: {
          $or: [
            {
              "designer.fullName":
                searchRegex,
            },
            {
              "designer.email":
                searchRegex,
            },
          ],
        },
      });
    }

    pipeline.push(
      {
        $sort: {
          updatedAt: -1,
        },
      },

      {
        $facet: {
          data: [
            {
              $skip: pagination.skip,
            },

            {
              $limit: pagination.limit,
            },

            {
              $project: {
                versions: 0,
              },
            },
          ],

          total: [
            {
              $count: "count",
            },
          ],
        },
      }
    );

    const result =
      await MoodBoard.aggregate(
        pipeline
      );

    const data =
      result[0]?.data ?? [];

    const total =
      result[0]?.total?.[0]
        ?.count ?? 0;

    return {
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(
          total / pagination.limit
        ),
      },
    };
  };