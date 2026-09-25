import { Request, Response, NextFunction } from "express";

import * as materialService from "../services/material.service";

import { ApiResponse } from "../../../utils/ApiResponse";
import { ApiError } from "../../../utils/ApiError";
import { uploadBufferToCloudinary } from "../../../utils/cloudinary";

// Create Material
export const createMaterial = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, name, price } = req.body;

    if (!req.files || !Array.isArray(req.files)) {
      throw new ApiError(
        400,
        "At least one material image is required"
      );
    }

    const images = await Promise.all(
      req.files.map((file) =>
        uploadBufferToCloudinary(
          file.buffer,
          "designflow/materials"
        )
      )
    );

    const material =
      await materialService.createMaterial({
        type,
        name,
        price: Number(price),
        images,
      });

    res.status(201).json(
      new ApiResponse(
        201,
        "Material created successfully",
        material
      )
    );
  } catch (error) {
    next(error);
  }
};

// Get All Materials
export const getMaterials = async (
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
      await materialService.getMaterials(
        page,
        limit
      );

    res.status(200).json(
      new ApiResponse(
        200,
        "Materials fetched successfully",
        result
      )
    );
  } catch (error) {
    next(error);
  }
};

// Get Material By ID
export const getMaterialById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const material =
      await materialService.getMaterialById(id);

    res.status(200).json(
      new ApiResponse(
        200,
        "Material fetched successfully",
        material
      )
    );
  } catch (error) {
    next(error);
  }
};

// Update Material
export const updateMaterial = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const { type, name, price } = req.body;

    let images: string[] | undefined;

    if (req.files && Array.isArray(req.files)) {
      images = await Promise.all(
        req.files.map((file) =>
          uploadBufferToCloudinary(
            file.buffer,
            "designflow/materials"
          )
        )
      );
    }

    const material =
      await materialService.updateMaterial(
        id,
        {
          type,
          name,
          price:
            price !== undefined
              ? Number(price)
              : undefined,
          ...(images && { images }),
        }
      );

    res.status(200).json(
      new ApiResponse(
        200,
        "Material updated successfully",
        material
      )
    );
  } catch (error) {
    next(error);
  }
};

// Delete Material
export const deleteMaterial = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await materialService.deleteMaterial(id);

    res.status(200).json(
      new ApiResponse(
        200,
        "Material deleted successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};