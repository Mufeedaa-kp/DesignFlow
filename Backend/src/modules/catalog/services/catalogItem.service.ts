import CatalogItem from "../models/catalogItem.model";
import Category from "../models/category.model";
import { ApiError } from "../../../utils/ApiError";

// Create catalog item
export const createCatalogItem = async (data: {
  category: string;
  name: string;
  description: string;
  image: string;
  startingPrice: number;
  materials?: string[];
  colorThemes?: string[];
}) => {
  const categoryExists = await Category.findById(data.category);

  if (!categoryExists) {
    throw new ApiError(404, "Category not found");
  }

  const existingItem = await CatalogItem.findOne({
    category: data.category,
    name: data.name,
  });

  if (existingItem) {
    throw new ApiError(
      409,
      "Catalog item already exists in this category"
    );
  }

  const catalogItem = await CatalogItem.create({
    category: data.category,
    name: data.name,
    description: data.description,
    image: data.image,
    startingPrice: data.startingPrice,
    materials: data.materials || [],
    colorThemes: data.colorThemes || [],
  });

  return catalogItem;
};

// Get catalog items
export const getCatalogItems = async (
  categoryId?: string,
  page = 1,
  limit = 9
) => {
  const filter: {
    isActive: boolean;
    category?: string;
  } = {
    isActive: true,
  };

  if (categoryId) {
    filter.category = categoryId;
  }

  const skip = (page - 1) * limit;

  const [catalogItems, total] = await Promise.all([
    CatalogItem.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    CatalogItem.countDocuments(filter),
  ]);

  return {
    items: catalogItems,

    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get catalog item by ID
export const getCatalogItemById = async (id: string) => {
  const catalogItem = await CatalogItem.findById(id);

  if (!catalogItem) {
    throw new ApiError(404, "Catalog item not found");
  }

  return catalogItem;
};

// Update catalog item
export const updateCatalogItem = async (
  id: string,
  data: {
    category?: string;
    name?: string;
    description?: string;
    image?: string;
    startingPrice?: number;
    materials?: string[];
    colorThemes?: string[];
    isActive?: boolean;
  }
) => {
  if (data.category) {
    const categoryExists = await Category.findById(data.category);

    if (!categoryExists) {
      throw new ApiError(404, "Category not found");
    }
  }

  const catalogItem = await CatalogItem.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!catalogItem) {
    throw new ApiError(404, "Catalog item not found");
  }

  return catalogItem;
};

// Delete catalog item
export const deleteCatalogItem = async (id: string) => {
  const catalogItem = await CatalogItem.findByIdAndDelete(id);

  if (!catalogItem) {
    throw new ApiError(404, "Catalog item not found");
  }

  return catalogItem;
};