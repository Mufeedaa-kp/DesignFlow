import { Request, Response, NextFunction } from "express";
import * as settingsService from "./settings.service";
import { ApiResponse } from "../../utils/ApiResponse";

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await settingsService.getSettings();
    return res.status(200).json(new ApiResponse(200, "Settings fetched successfully", settings));
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await settingsService.updateSettings(req.body);
    return res.status(200).json(new ApiResponse(200, "Settings updated successfully", settings));
  } catch (error) {
    next(error);
  }
};