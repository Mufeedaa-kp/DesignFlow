import mongoose from "mongoose";

import { ProjectRequest } from "./projectRequest.model";
import { Project } from "../projects/project.model";
import { User } from "../users/user.model";

import Category from "../catalog/models/category.model";
import CatalogItem from "../catalog/models/catalogItem.model";
import Material from "../catalog/models/material.model";
import ColorTheme from "../catalog/models/colorTheme.model";

import { ApiError } from "../../utils/ApiError";
import { uploadBufferToCloudinary } from "../../utils/cloudinary";

import { createNotificationService } from "../notifications/notification.service";

interface CreateProjectRequestData {
  projectName: string;

  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
  };

  category: string;
  catalogItem: string;

  materials?: string[];
  colorThemes?: string[];

measurements: {
  height: number;
  width: number;
  unit: "ft" | "cm";
  squareFeet: number;
}

  description: string;

  referenceImages?: string[];

  needBy?: string;
}

export const uploadRequestImage = async (
  buffer: Buffer
) => {
  const url = await uploadBufferToCloudinary(
    buffer,
    "designflow/project-requests"
  );

  return url;
};

export const createProjectRequest = async (
  clientId: string,
  data: CreateProjectRequestData
) => {
 
  const client = await User.findById(clientId).select(
    "fullName email phone address"
  );

  if (!client) {
    throw new ApiError(404, "Client not found");
  }

  const personalInfo = {
    fullName: (data.personalInfo?.fullName || client.fullName || "").trim(),
    email: (data.personalInfo?.email || client.email || "").trim(),
    phone: (data.personalInfo?.phone || client.phone || "").trim(),
    address: (data.personalInfo?.address || client.address || "").trim(),
  };

  const category = await Category.findById(
    data.category
  );

  if (!category || !category.isActive) {
    throw new ApiError(
      404,
      "Category not found"
    );
  }

  const catalogItem = await CatalogItem.findOne({
    _id: data.catalogItem,
    category: data.category,
    isActive: true,
  });

  if (!catalogItem) {
    throw new ApiError(
      404,
      "Catalog item not found in this category"
    );
  }



  const materialIds = data.materials || [];

  const materials = await Material.find({
    _id: { $in: materialIds },
    isActive: true,
  });

  if (materials.length !== materialIds.length) {
    throw new ApiError(
      400,
      "One or more selected materials are invalid"
    );
  }


  const colorThemeIds = data.colorThemes || [];

  const colorThemes = await ColorTheme.find({
    _id: { $in: colorThemeIds },
    isActive: true,
  });

  if (
    colorThemes.length !== colorThemeIds.length
  ) {
    throw new ApiError(
      400,
      "One or more selected color themes are invalid"
    );
  }


  const materialTotal = materials.reduce(
    (total, material) =>
      total + material.price,
    0
  );

  const estimatedTotal =
    catalogItem.startingPrice +
    materialTotal;


  const request = await ProjectRequest.create({
    client: clientId,

    projectName: data.projectName,

    personalInfo,

    category: category._id,

    catalogItem: catalogItem._id,

    materials: materialIds,

    colorThemes: colorThemeIds,

    measurements: data.measurements,

    description: data.description,

    referenceImages:
      data.referenceImages || [],

    needBy: data.needBy,

    estimatedTotal,

    status: "pending",
  });

  const admin = await User.findOne({
    role: "admin",
  }).select("_id");

  if (admin) {
    await createNotificationService({
      recipient: admin._id,
      type: "PROJECT_REQUEST_SUBMITTED",
      title: "New Project Request",
      message: `A new project request "${request.projectName}" has been submitted.`,
      project: request._id,
      link: `/admin/requests/${request._id}`,

    });
  }

  return request;
};


const escapeRegex = (value: string) => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};


export const getMyProjectRequests = async (
  clientId: string,
  page = 1,
  limit = 9,
  search = "",
  status = ""
) => {
  const skip = (page - 1) * limit;

  const matchStage: Record<string, unknown> = {
    client: new mongoose.Types.ObjectId(
      clientId
    ),
  };

  if (
    status &&
    ["pending", "approved", "rejected"].includes(
      status
    )
  ) {
    matchStage.status = status;
  }

  const pipeline: any[] = [
    {
      $match: matchStage,
    },


    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },

    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: "catalogitems",
        localField: "catalogItem",
        foreignField: "_id",
        as: "catalogItem",
      },
    },

    {
      $unwind: {
        path: "$catalogItem",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  if (search.trim()) {
    const searchRegex = new RegExp(
      escapeRegex(search.trim()),
      "i"
    );

    pipeline.push({
      $match: {
        $or: [
          {
            "category.name": searchRegex,
          },
          {
            "catalogItem.name": searchRegex,
          },
        ],
      },
    });
  }

  pipeline.push({
    $lookup: {
      from: "materials",
      localField: "materials",
      foreignField: "_id",
      as: "materials",
    },
  });

  pipeline.push({
    $lookup: {
      from: "colorthemes",
      localField: "colorThemes",
      foreignField: "_id",
      as: "colorThemes",
    },
  });

  pipeline.push({
    $sort: {
      createdAt: -1,
    },
  });


  pipeline.push({
    $facet: {
      requests: [
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ],

      pagination: [
        {
          $count: "total",
        },
      ],
    },
  });

  const [result] =
    await ProjectRequest.aggregate(
      pipeline
    );

  const requests = result?.requests ?? [];

  const total =
    result?.pagination?.[0]?.total ?? 0;

  return {
    requests,

    pagination: {
      total,
      page,
      limit,
      totalPages:
        total === 0
          ? 0
          : Math.ceil(total / limit),
    },
  };
};

export const getAllProjectRequests = async (
  page: number,
  limit: number,
  status?: string
) => {
  const filter: Record<string, unknown> =
    {};

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [requests, total] =
    await Promise.all([
      ProjectRequest.find(filter)
        .populate(
          "client",
          "fullName email phone"
        )
        .populate(
          "category",
          "name image"
        )
        .populate(
          "catalogItem",
          "name image startingPrice"
        )
        .populate(
          "materials",
          "type name price images"
        )
        .populate(
          "colorThemes",
          "name image"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      ProjectRequest.countDocuments(filter),
    ]);

  return {
    requests,

    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
};



export const getProjectRequestById = async (
  id: string,
  clientId?: string
) => {
  const filter: Record<string, unknown> = {
    _id: id,
  };

  if (clientId) {
    filter.client = clientId;
  }

  const request =
    await ProjectRequest.findOne(filter)
      .populate(
        "client",
        "fullName email phone address"
      )
      .populate(
        "category",
        "name description image"
      )
      .populate(
        "catalogItem",
        "name description image startingPrice"
      )
      .populate(
        "materials",
        "type name price images"
      )
      .populate(
        "colorThemes",
        "name image"
      );

  if (!request) {
    throw new ApiError(
      404,
      "Project request not found"
    );
  }

  return request;
};

export const approveProjectRequest = async (
  id: string
) => {
  const session =
    await mongoose.startSession();

  let request;
  let project;

  try {
    session.startTransaction();

    request =
      await ProjectRequest.findById(id)
        .session(session);

    if (!request) {
      throw new ApiError(
        404,
        "Project request not found"
      );
    }

    if (request.status !== "pending") {
      throw new ApiError(
        400,
        `Request is already ${request.status}`
      );
    }

    request.status = "approved";

    await request.save({
      session,
    });

    [project] =
      await Project.create(
        [
          {
            sourceRequest:
              request._id,

            client:
              request.client,

            status: "planning",
          },
        ],
        {
          session,
        }
      );

    await session.commitTransaction();

  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }

 
  await createNotificationService({
    recipient: request.client,
    type: "PROJECT_REQUEST_APPROVED",
    title: "Project Request Approved",
    message: `Your project request "${request.projectName}" has been approved.`,
    project: project._id,
    link: `/client/requests/${request._id}`,
  });

  return {
    request,
    project,
  };
};

export const rejectProjectRequest = async (
  id: string,
  rejectionReason?: string
) => {
  const request =
    await ProjectRequest.findById(id);

  if (!request) {
    throw new ApiError(
      404,
      "Project request not found"
    );
  }

  if (request.status !== "pending") {
    throw new ApiError(
      400,
      `Request is already ${request.status}`
    );
  }

  request.status = "rejected";

  if (rejectionReason) {
    request.rejectionReason =
      rejectionReason;
  }

   await request.save();

  await createNotificationService({
    recipient: request.client,
    type: "PROJECT_REQUEST_REJECTED",
    title: "Project Request Rejected",
    message: `Your project request "${request.projectName}" has been rejected.`,
    project: request._id,
    link: `/client/requests/${request._id}`,
  });

  return request;
};