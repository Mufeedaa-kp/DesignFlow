import Category from "../models/category.model";
import { ApiError } from "../../../utils/ApiError";

// Create category
export const createCategory = async (data: {
  name: string;
  description: string;
  image: string;
}) => {
  const existingCategory = await Category.findOne({
    name: data.name,
  });

  if (existingCategory) {
    throw new ApiError(409, "Category already exists");
  }

  const category = await Category.create(data);

  return category;
};

// Get all categories
export const getCategories = async () => {
  const categories = await Category.find({
    isActive: true,
  }).sort({
    createdAt: -1,
  });

  return categories;
}

// Get one category
export const getCategoryById = async (id: string) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
}

// Update category
export const updateCategory = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    image?: string;
    isActive?: boolean;
  }
) => {
  const category = await Category.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

// Delete category
export const deleteCategory = async (id: string) => {
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

