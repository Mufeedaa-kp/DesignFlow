import { Request, Response, NextFunction } from "express";
import * as analyticsService from "./analytics.service";
import { ApiResponse } from "../../utils/ApiResponse";

export const getOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await analyticsService.getAnalyticsOverview();
    return res.status(200).json(new ApiResponse(200, "Analytics fetched successfully", data));
  } catch (error) {
    next(error);
  }
};