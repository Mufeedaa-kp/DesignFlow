import { Request, Response, NextFunction } from "express";

import * as catalogItemService from "../services/catalogItem.service";

import { ApiResponse } from "../../../utils/ApiResponse";
import { ApiError } from "../../../utils/ApiError";

import { uploadBufferToCloudinary } from "../../../utils/cloudinary";

// Create catalog item
export const createCatalogItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      description,
      category,
      startingPrice,
      materials,
      colorThemes,
    } = req.body;

    if (!req.file) {
      throw new ApiError(
        400,
        "Catalog item image is required"
      );
    }

    const imageUrl = await uploadBufferToCloudinary(
      req.file.buffer,
      "designflow/catalog-items"
    )

    const catalogItem =
      await catalogItemService.createCatalogItem({
        category,
        name,
        description,
        image: imageUrl,
        startingPrice,
        materials,
        colorThemes,
      });

    res.status(201).json(
      new ApiResponse(
        201,
        "Catalog item created successfully",
        catalogItem
      )
    );
  } catch (error) {
    next(error);
  }
};

// Get catalog items
export const getCatalogItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId =
      typeof req.query.categoryId === "string"
        ? req.query.categoryId
        : undefined;

    const page =
      typeof req.query.page === "string"
        ? Number(req.query.page)
        : 1;

    const limit =
      typeof req.query.limit === "string"
        ? Number(req.query.limit)
        : 9;

    const result =
      await catalogItemService.getCatalogItems(
        categoryId,
        page,
        limit
      );

    res.status(200).json(
      new ApiResponse(
        200,
        "Catalog items fetched successfully",
        result
      )
    );
  } catch (error) {
    next(error);
  }
};

// Get catalog item by ID
export const getCatalogItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const catalogItem =
      await catalogItemService.getCatalogItemById(id);

    res.status(200).json(
      new ApiResponse(
        200,
        "Catalog item fetched successfully",
        catalogItem
      )
    );
  } catch (error) {
    next(error);
  }
};

// Update catalog item
export const updateCatalogItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const updateData: {
      category?: string;
      name?: string;
      description?: string;
      image?: string;
      startingPrice?: number;
      materials?: string[];
      colorThemes?: string[];
    } = { ...req.body };

    if (req.file) {
      const imageUrl = await uploadBufferToCloudinary(
        req.file.buffer,
        "designflow/catalog-items"
      );

      updateData.image = imageUrl;
    }

    const catalogItem =
      await catalogItemService.updateCatalogItem(
        id,
        updateData
      );

    res.status(200).json(
      new ApiResponse(
        200,
        "Catalog item updated successfully",
        catalogItem
      )
    );
  } catch (error) {
    next(error);
  }
};

// Delete catalog item
export const deleteCatalogItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await catalogItemService.deleteCatalogItem(id);

    res.status(200).json(
      new ApiResponse(
        200,
        "Catalog item deleted successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};