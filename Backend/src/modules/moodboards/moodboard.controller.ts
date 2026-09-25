import { Request, Response } from "express";
import {
  addMoodBoardVersionService,
  approveMoodBoardService,
  createMoodBoardService,
  getClientMoodBoardService,
  getClientMoodBoardsService,
  getDesignerMoodBoardService,
  getAdminMoodBoardService,
  getDesignerMoodBoardsService,
  requestMoodBoardChangesService,
  submitMoodBoardService,
} from "./moodboard.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import {
  uploadBufferToCloudinaryWithDetails,
} from "../../utils/cloudinary";

interface UploadedMoodBoardFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}


const getParamId = (
  value: string | string[] | undefined
): string => {
  if (!value || Array.isArray(value)) {
    throw new ApiError(
      400,
      "Invalid project ID"
    );
  }

  return value;
};

const getProjectId = (req: Request): string => {
  const projectId = req.params.projectId;

  if (typeof projectId !== "string") {
    throw new ApiError(
      400,
      "Invalid project ID"
    );
  }

  return projectId;
};

const getUploadedFiles = (
  req: Request
): UploadedMoodBoardFile[] => {
  const files = req.files as
    | UploadedMoodBoardFile[]
    | undefined;

  return files || [];
};

const getFileType = (
  mimetype: string
): "image" | "pdf" => {
  if (mimetype === "application/pdf") {
    return "pdf";
  }

  return "image";
};

const uploadMoodBoardFiles = async (
  files: UploadedMoodBoardFile[],
  projectId: string
) => {
  if (files.length === 0) {
    throw new ApiError(
      400,
      "At least one design file is required"
    );
  }

  const uploadedFiles = await Promise.all(
    files.map(async (file) => {
      const result =
        await uploadBufferToCloudinaryWithDetails(
          file.buffer,
          `designflow/moodboards/${projectId}`
        );

      return {
        url: result.secure_url,
        publicId: result.public_id,
        fileName: file.originalname,
        fileType: getFileType(file.mimetype),
      };
    })
  );

  return uploadedFiles;
};

const uploadClientReferenceImages = async (
  files: UploadedMoodBoardFile[],
  projectId: string
) => {
  if (files.length === 0) {
    return [];
  }

  const uploadedImages =
    await Promise.all(
      files.map(async (file) => {
        if (
          !file.mimetype.startsWith("image/")
        ) {
          throw new ApiError(
            400,
            "Client reference files must be images"
          );
        }

        const result =
          await uploadBufferToCloudinaryWithDetails(
            file.buffer,
            `designflow/moodboards/${projectId}/client-references`
          );

        return result.secure_url;
      })
    );

  return uploadedImages;
};


export const createMoodBoard = async (
  req: Request,
  res: Response
) => {
  const { projectId, designerNotes } =
    req.body;

  if (typeof projectId !== "string") {
    throw new ApiError(
      400,
      "Invalid project ID"
    );
  }

  const files = getUploadedFiles(req);

  const uploadedFiles =
    await uploadMoodBoardFiles(
      files,
      projectId
    );

  const moodBoard =
    await createMoodBoardService({
      projectId,
      designerId: req.user.id,
      files: uploadedFiles,
      designerNotes,
    });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "Mood Board created successfully",
        moodBoard
      )
    );
};



export const addMoodBoardVersion =
  async (
    req: Request,
    res: Response
  ) => {
    const projectId = getProjectId(req);

    const { designerNotes } =
      req.body;

    const files = getUploadedFiles(req);

    const uploadedFiles =
      await uploadMoodBoardFiles(
        files,
        projectId
      );

    const moodBoard =
      await addMoodBoardVersionService({
        projectId,
        designerId: req.user.id,
        files: uploadedFiles,
        designerNotes,
      });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "Mood Board version created successfully",
          moodBoard
        )
      );
  };


export const submitMoodBoard = async (
  req: Request,
  res: Response
) => {
  const projectId = getProjectId(req);

  const moodBoard =
    await submitMoodBoardService({
      projectId,
      designerId: req.user.id,
    });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Mood Board submitted successfully",
        moodBoard
      )
    );
};


export const requestMoodBoardChanges =
  async (
    req: Request,
    res: Response
  ) => {
    const projectId = getProjectId(req);

    const {
      clientFeedback,
    } = req.body;

    const files = getUploadedFiles(req);

    const referenceImages =
      await uploadClientReferenceImages(
        files,
        projectId
      );

    const moodBoard =
      await requestMoodBoardChangesService({
        projectId,
        clientId: req.user.id,
        clientFeedback,
        clientReferenceImages:
          referenceImages,
      });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Changes requested successfully",
          moodBoard
        )
      );
  };


export const approveMoodBoard =
  async (
    req: Request,
    res: Response
  ) => {
    const projectId = getProjectId(req);

    const moodBoard =
      await approveMoodBoardService({
        projectId,
        clientId: req.user.id,
      });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Mood Board approved successfully",
          moodBoard
        )
      );
  };


export const getDesignerMoodBoard =
  async (
    req: Request,
    res: Response
  ) => {
    const projectId = getProjectId(req);

    const moodBoard =
      await getDesignerMoodBoardService({
        projectId,
        designerId: req.user.id,
      });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Mood Board fetched successfully",
          moodBoard
        )
      );
  };


export const getClientMoodBoard =
  async (
    req: Request,
    res: Response
  ) => {
    const projectId = getProjectId(req);

    const moodBoard =
      await getClientMoodBoardService({
        projectId,
        clientId: req.user.id,
      });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Mood Board fetched successfully",
          moodBoard
        )
      );
  };

export const getDesignerMoodBoards =
  async (
    req: Request,
    res: Response
  ) => {
    const page = Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : "";

    const result =
      await getDesignerMoodBoardsService({
        userId: req.user.id,
        role: "designer",
        page,
        limit,
        search,
      });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Mood Boards fetched successfully",
          result
        )
      );
  };

  
export const getAdminMoodBoard = async (
  req: Request,
  res: Response
) => {
  const projectId = getParamId(
    req.params.projectId
  );

  const moodBoard =
    await getAdminMoodBoardService(
      projectId
    );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Mood Board fetched successfully",
        moodBoard
      )
    );
};

export const getClientMoodBoards =
  async (
    req: Request,
    res: Response
  ) => {
    const page = Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : "";

    const result =
      await getClientMoodBoardsService({
        userId: req.user.id,
        role: "client",
        page,
        limit,
        search,
      });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Mood Boards fetched successfully",
          result
        )
      );
  };