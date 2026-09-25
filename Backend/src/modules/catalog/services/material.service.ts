import Material from "../models/material.model";
import { ApiError } from "../../../utils/ApiError";

interface CreateMaterialData {
  type: string;
  name: string;
  price: number;
  images: string[];
}

interface UpdateMaterialData {
  type?: string;
  name?: string;
  price?: number;
  images?: string[];
}

export const createMaterial = async (
  data: CreateMaterialData
) => {
  const existingMaterial = await Material.findOne({
    type: data.type,
    name: data.name,
  });

  if (existingMaterial) {
    throw new ApiError(
      409,
      "Material already exists in this type"
    );
  }

  return await Material.create(data);
};

export const getMaterials = async (
  page = 1,
  limit = 9
) => {
  const skip = (page - 1) * limit;

  const [materials, total] = await Promise.all([
    Material.find()
      .sort({
        type: 1,
        name: 1,
      })
      .skip(skip)
      .limit(limit),

    Material.countDocuments(),
  ]);

  return {
    items: materials,

    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
export const getMaterialById = async (id: string) => {
  const material = await Material.findById(id);

  if (!material) {
    throw new ApiError(404, "Material not found");
  }

  return material;
};

export const updateMaterial = async (
  id: string,
  data: UpdateMaterialData
) => {
  const material = await Material.findById(id);

  if (!material) {
    throw new ApiError(404, "Material not found");
  }

  if (data.type || data.name) {
    const existingMaterial = await Material.findOne({
      type: data.type ?? material.type,
      name: data.name ?? material.name,
      _id: { $ne: id },
    })

    if (existingMaterial) {
      throw new ApiError(
        409,
        "Material already exists in this type"
      );
    }
  }

  Object.assign(material, data);

  return await material.save();
}

export const deleteMaterial = async (id: string) => {
  const material = await Material.findById(id);

  if (!material) {
    throw new ApiError(404, "Material not found");
  }

  await material.deleteOne();

  return material;
};