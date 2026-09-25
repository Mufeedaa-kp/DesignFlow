import { Request, Response, NextFunction } from "express";

import * as colorThemeService from "../services/colorTheme.service";

import { ApiResponse } from "../../../utils/ApiResponse";
import { ApiError } from "../../../utils/ApiError";
import { uploadBufferToCloudinary } from "../../../utils/cloudinary";

// Create Color Theme
export const createColorTheme = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    if (!req.file) {
      throw new ApiError(
        400,
        "Color theme image is required"
      );
    }

    const imageUrl =
      await uploadBufferToCloudinary(
        req.file.buffer,
        "designflow/color-themes"
      );

    const colorTheme =
      await colorThemeService.createColorTheme({
        name,
        image: imageUrl,
      });

    res.status(201).json(
      new ApiResponse(
        201,
        "Color theme created successfully",
        colorTheme
      )
    );
  } catch (error) {
    next(error);
  }
};

// Get All Color Themes
export const getColorThemes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page =
      typeof req.query.page === "string"
        ? Number(req.query.page)
        : 1;

    const limit =
      typeof req.query.limit === "string"
        ? Number(req.query.limit)
        : 9;

    const result =
      await colorThemeService.getColorThemes(
        page,
        limit
      );

    res.status(200).json(
      new ApiResponse(
        200,
        "Color themes fetched successfully",
        result
      )
    );
  } catch (error) {
    next(error);
  }
};
// Get Color Theme By ID
export const getColorThemeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const colorTheme =
      await colorThemeService.getColorThemeById(id);

    res.status(200).json(
      new ApiResponse(
        200,
        "Color theme fetched successfully",
        colorTheme
      )
    );
  } catch (error) {
    next(error);
  }
};

// Update Color Theme
export const updateColorTheme = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const { name } = req.body;

    let image;

    if (req.file) {
      image = await uploadBufferToCloudinary(
        req.file.buffer,
        "designflow/color-themes"
      );
    }

    const colorTheme =
      await colorThemeService.updateColorTheme(
        id,
        {
          name,
          ...(image && { image }),
        }
      );

    res.status(200).json(
      new ApiResponse(
        200,
        "Color theme updated successfully",
        colorTheme
      )
    );
  } catch (error) {
    next(error);
  }
};

// Delete Color Theme
export const deleteColorTheme = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await colorThemeService.deleteColorTheme(id);

    res.status(200).json(
      new ApiResponse(
        200,
        "Color theme deleted successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};