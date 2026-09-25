
import api from "../../../services/api";

import type {
  ICategory,
  ICatalogItem,
  IMaterial,
  IColorTheme,
} from "../types/catalog.types";

// Materials

export const getMaterials = async (
  page = 1,
  limit = 9
) => {
  const response = await api.get("/catalog/materials", {
    params: {
      page,
      limit,
    },
  });

  return response.data.data;
};

export const createMaterial = async (
  data: FormData
): Promise<IMaterial> => {
  const response = await api.post(
    "/catalog/materials",
    data
  );

  return response.data.data;
};

export const updateMaterial = async (
  id: string,
  data: FormData
): Promise<IMaterial> => {
  const response = await api.patch(
    `/catalog/materials/${id}`,
    data
  );

  return response.data.data;
};

export const deleteMaterial = async (
  id: string
): Promise<IMaterial> => {
  const response = await api.delete(
    `/catalog/materials/${id}`
  );

  return response.data.data;
};

// Color Themes

export const getColorThemes = async (
  page = 1,
  limit = 9
) => {
  const response = await api.get(
    "/catalog/color-themes",
    {
      params: {
        page,
        limit,
      },
    }
  );

  return response.data.data;
};

export const createColorTheme = async (
  data: FormData
): Promise<IColorTheme> => {
  const response = await api.post(
    "/catalog/color-themes",
    data
  );

  return response.data.data;
};

export const updateColorTheme = async (
  id: string,
  data: FormData
): Promise<IColorTheme> => {
  const response = await api.patch(
    `/catalog/color-themes/${id}`,
    data
  );

  return response.data.data;
};

export const deleteColorTheme = async (
  id: string
): Promise<IColorTheme> => {
  const response = await api.delete(
    `/catalog/color-themes/${id}`
  );

  return response.data.data;
};

// Categories

export const getCategories = async (): Promise<ICategory[]> => {
  const response = await api.get("/catalog/categories");

  return response.data.data;
};

export const createCategory = async (
  data: FormData
): Promise<ICategory> => {
  const response = await api.post(
    "/catalog/categories",
    data
  );

  return response.data.data;
};

export const updateCategory = async (
  id: string,
  data: FormData
): Promise<ICategory> => {
  const response = await api.patch(
    `/catalog/categories/${id}`,
    data
  );

  return response.data.data;
};

export const deleteCategory = async (
  id: string
): Promise<ICategory> => {
  const response = await api.delete(
    `/catalog/categories/${id}`
  );

  return response.data.data;
};

// Catalog Items

export const getCatalogItems = async (
  categoryId?: string,
  page = 1,
  limit = 9
) => {
  const response = await api.get("/catalog/items", {
    params: {
      categoryId,
      page,
      limit,
    },
  });

  return response.data.data;
};

export const createCatalogItem = async (
  data: FormData
): Promise<ICatalogItem> => {
  const response = await api.post(
    "/catalog/items",
    data
  );

  return response.data.data;
};

export const updateCatalogItem = async (
  id: string,
  data: FormData
): Promise<ICatalogItem> => {
  const response = await api.patch(
    `/catalog/items/${id}`,
    data
  );

  return response.data.data;
};

export const deleteCatalogItem = async (
  id: string
): Promise<ICatalogItem> => {
  const response = await api.delete(
    `/catalog/items/${id}`
  );

  return response.data.data;
};