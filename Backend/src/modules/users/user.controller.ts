import { Request, Response, NextFunction } from "express";
import * as userService from "./user.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { AuthRequest } from "../../middlewares/auth.middleware";

 
 
 
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.createUser(req.body);
 
    return res.status(201).json(
      new ApiResponse(201, "User created successfully", {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      })
    );
  } catch (error) {
    next(error);
  }
}
 
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as string | undefined;
 
    const result = await userService.getAllUsers(page, limit, role);
 
    return res.status(200).json(
      new ApiResponse(200, "Users fetched successfully", result)
    );
  } catch (error) {
    next(error);
  }
}
 
 
 
export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
 
  try {
 
    const user = await userService.getUserById(
      req.params.id
    )
 
 
    return res.status(200).json(
      new ApiResponse(
        200,
        "User fetched successfully",
        user
      )
    );
 
 
  } catch (error) {
 
    next(error);
 
  }
 
}
 
export const updateUserProfile = async (
  req: AuthRequest & Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const isOwnProfile = req.user?.id === req.params.id;
    const isAdmin = req.user?.role === "admin";
 
    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
 
    const user = await userService.updateUserProfile(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, "Profile updated successfully", user));
  } catch (error) {
    next(error);
  }
}
 
export const updateUserStatus = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.updateUserStatus(req.params.id, req.body.status);
 
    return res.status(200).json(
      new ApiResponse(200, "User status updated successfully", user)
    );
  } catch (error) {
    next(error);
  }
}
 
export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    await userService.deleteUser(req.params.id);
 
    return res.status(200).json(
      new ApiResponse(200, "User deleted successfully")
    );
  } catch (error) {
    next(error);
  }
}

export const getMyClients = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await userService.getClientsForDesigner(req.user!.id, page, limit, search);
    return res.status(200).json(new ApiResponse(200, "Clients fetched", result));
  } catch (error) { next(error); }
};

export const getMyClientById = async (req: AuthRequest<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getClientForDesigner(req.user!.id, req.params.id);
    return res.status(200).json(new ApiResponse(200, "Client fetched", user));
  } catch (error) { next(error); }
};