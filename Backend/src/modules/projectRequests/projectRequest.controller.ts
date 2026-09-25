import {
  Request,
  Response,
  NextFunction,
} from "express";

import * as projectRequestService from "./projectRequest.service";

import { ApiResponse } from "../../utils/ApiResponse";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { ApiError } from "../../utils/ApiError";

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      throw new ApiError(
        400,
        "No image file provided"
      );
    }

    const url =
      await projectRequestService.uploadRequestImage(
        req.file.buffer
      );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Image uploaded successfully",
          { url }
        )
      );
  } catch (error) {
    next(error);
  }
};

export const createProjectRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const request =
      await projectRequestService.createProjectRequest(
        req.user!.id,
        req.body
      );

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "Project request submitted successfully",
          request
        )
      );
  } catch (error) {
    next(error);
  }
};

export const getMyProjectRequests = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page =
      parseInt(
        req.query.page as string
      ) || 1;

    const limit =
      parseInt(
        req.query.limit as string
      ) || 9;

    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : "";

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : "";

    const result =
      await projectRequestService.getMyProjectRequests(
        req.user!.id,
        page,
        limit,
        search,
        status
      );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Your project requests fetched successfully",
          result
        )
      );
  } catch (error) {
    next(error);
  }
};

export const getAllProjectRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page =
      parseInt(
        req.query.page as string
      ) || 1;

    const limit =
      parseInt(
        req.query.limit as string
      ) || 10;

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : undefined;

    const result =
      await projectRequestService.getAllProjectRequests(
        page,
        limit,
        status
      );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Project requests fetched successfully",
          result
        )
      );
  } catch (error) {
    next(error);
  }
};

export const getProjectRequestById = async (
  req: AuthRequest & {
    params: {
      id: string;
    };
  },
  res: Response,
  next: NextFunction
) => {
  try {
    /*
     * Admin can view any request.
     *
     * Client can only view their own request.
     */
    const clientId =
      req.user?.role === "client"
        ? req.user.id
        : undefined;

    const request =
      await projectRequestService.getProjectRequestById(
        req.params.id,
        clientId
      );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Project request fetched successfully",
          request
        )
      );
  } catch (error) {
    next(error);
  }
};

export const approveProjectRequest = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result =
      await projectRequestService.approveProjectRequest(
        req.params.id
      );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Project request approved and project created",
          result
        )
      );
  } catch (error) {
    next(error);
  }
};

export const rejectProjectRequest = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const request =
      await projectRequestService.rejectProjectRequest(
        req.params.id,
        req.body.rejectionReason
      );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Project request rejected",
          request
        )
      );
  } catch (error) {
    next(error);
  }
};