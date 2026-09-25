import { Request, Response, NextFunction } from "express"
import * as projectService from "./project.service"
import { ApiResponse } from "../../utils/ApiResponse"
import { AuthRequest } from "../../middlewares/auth.middleware"
import { ApiError } from "../../utils/ApiError"

export const getMyProjects = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await projectService.getMyProjects(req.user!.id)
    return res
      .status(200)
      .json(new ApiResponse(200, "Your projects fetched successfully", projects))
  } catch (error) {
    next(error);
  }
}

export const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const status = req.query.status as string | undefined;
    const sort = (req.query.sort as "newest" | "oldest") || "newest"
    const dateRange = req.query.dateRange as string | undefined

    const result = await projectService.getAllProjects(page, limit, status, sort, dateRange);

    return res
      .status(200)
      .json(new ApiResponse(200, "Projects fetched successfully", result))
  } catch (error) {
    next(error);
  }
}

export const getProjectById = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user!);
    return res
      .status(200)
      .json(new ApiResponse(200, "Project fetched successfully", project));
  } catch (error) {
    next(error);
  }
}

export const updateProjectStatusHandler = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;
    const project = await projectService.updateProjectStatus(req.params.id, status, req.user!);
    return res
      .status(200)
      .json(new ApiResponse(200, "Project status updated", project));
  } catch (error) {
    next(error);
  }
}

export const assignDesignerHandler = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const { designerId } = req.body;
    const project = await projectService.assignDesigner(req.params.id, designerId);
    return res.status(200).json(new ApiResponse(200, "Designer assigned successfully", project));
  } catch (error) {
    next(error);
  }
}

export const getMyAssignedProjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projects = await projectService.getProjectsByDesigner(req.user!.id);
    return res
      .status(200)
      .json(new ApiResponse(200, "Assigned projects fetched successfully", projects));
  } catch (error) {
    next(error);
  }
}

export const acceptAssignmentHandler = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await projectService.acceptAssignment(req.params.id, req.user!.id);
    return res
      .status(200)
      .json(new ApiResponse(200, "Assignment accepted", project));
  } catch (error) {
    next(error);
  }
};

export const rejectAssignmentHandler = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      throw new ApiError(400, "Rejection reason is required");
    }
    const project = await projectService.rejectAssignment(req.params.id, req.user!.id, reason);
    return res
      .status(200)
      .json(new ApiResponse(200, "Assignment rejected", project));
  } catch (error) {
    next(error);
  }
}