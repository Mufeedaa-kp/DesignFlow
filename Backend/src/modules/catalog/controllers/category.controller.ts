import { Request, Response, NextFunction } from "express";

import {
  createCategory as createCategoryService,
  getCategories as getCategoriesService,
  getCategoryById as getCategoryByIdService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
} from "../services/category.service";

import { uploadBufferToCloudinary } from "../../../utils/cloudinary";

import { ApiResponse } from "../../../utils/ApiResponse";
import { ApiError } from "../../../utils/ApiError";

// Create category
export const createCategory = async (
  req: Request,
  res: Response
) => {
  const { name, description } = req.body;

  if (!req.file) {
    throw new ApiError(400, "Category image is required");
  }

  const imageUrl = await uploadBufferToCloudinary(
    req.file.buffer,
    "designflow/categories"
  );

  const category = await createCategoryService({
    name,
    description,
    image: imageUrl,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "Category created successfully",
        category
      )
    );
};

// Get all categories
export const getCategories = async (
  _req: Request,
  res: Response
) => {
  const categories = await getCategoriesService();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Categories fetched successfully",
        categories
      )
    );
};

// Get category by ID
export const getCategoryById = async (
  req: Request,
  res: Response
) => {
  const id = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  const category = await getCategoryByIdService(id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Category fetched successfully",
        category
      )
    );
};

// Update category
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;

    const { name, description } = req.body;

    let image;

    if (req.file) {
      image = await uploadBufferToCloudinary(
        req.file.buffer,
        "designflow/categories"
      );
    }

    const category = await updateCategoryService(
      id,
      {
        name,
        description,
        ...(image && { image }),
      }
    );

    res.status(200).json(
      new ApiResponse(
        200,
        "Category updated successfully",
        category
      )
    );
  } catch (error) {
    next(error);
  }
};

// Delete category
export const deleteCategory = async (
  req: Request,
  res: Response
) => {
  const id = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  const category = await deleteCategoryService(id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Category deleted successfully",
        category
      )
    );
};