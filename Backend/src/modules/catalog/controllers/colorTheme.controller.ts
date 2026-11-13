
import { Request, Response, NextFunction } from "express";

import * as colorThemeService from "../services/colorTheme.service";

import { ApiResponse } from "../../../utils/ApiResponse";

// Create Color Theme
export const createColorTheme = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, colors } = req.body;

    const colorTheme =
      await colorThemeService.createColorTheme({
        name,
        colors,
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

    const { name, colors, isActive } = req.body;

    const colorTheme =
      await colorThemeService.updateColorTheme(
        id,
        {
          ...(name !== undefined && { name }),
          ...(colors !== undefined && { colors }),
          ...(isActive !== undefined && { isActive }),
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
