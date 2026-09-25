import { Response, NextFunction } from "express";
import * as profileService from "./profile.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { uploadBufferToCloudinary } from "../../utils/cloudinary";
 
export const getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
 
    const user = await profileService.getMyProfile(req.user.id);
    return res.status(200).json(new ApiResponse(200, "Profile fetched successfully", user));
  } catch (error) {
    next(error);
  }
};
 
export const updateMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated");
 
    const user = await profileService.updateMyProfile(req.user.id, req.body);
    return res.status(200).json(new ApiResponse(200, "Profile updated successfully", user));
  } catch (error) {
    next(error);
  }
};
 
export const uploadProfileImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "No image file provided");
    }
 
    const url = await uploadBufferToCloudinary(req.file.buffer, "profile-images");
 
    return res.status(200).json(new ApiResponse(200, "Image uploaded successfully", { url }));
  } catch (error) {
    next(error);
  }
};
 