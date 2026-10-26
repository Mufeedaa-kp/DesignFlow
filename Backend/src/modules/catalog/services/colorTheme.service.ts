import ColorTheme from "../models/colorTheme.model";
import { ApiError } from "../../../utils/ApiError";

interface CreateColorThemeData {
  name: string;
  image: string;
}

interface UpdateColorThemeData {
  name?: string;
  image?: string;
}

export const createColorTheme = async (
  data: CreateColorThemeData
) => {
  const existingColorTheme =
    await ColorTheme.findOne({
      name: data.name,
    });

  if (existingColorTheme) {
    throw new ApiError(
      409,
      "Color theme already exists",
      "COLOR_THEME_EXISTS"
    );
  }

  return await ColorTheme.create(data);
};

export const getColorThemes = async (
  page = 1,
  limit = 9
) => {
  const skip = (page - 1) * limit;

  const [colorThemes, total] = await Promise.all([
    ColorTheme.find()
      .sort({
        name: 1,
      })
      .skip(skip)
      .limit(limit),

    ColorTheme.countDocuments(),
  ]);

  return {
    items: colorThemes,

    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getColorThemeById = async (
  id: string
) => {
  const colorTheme =
    await ColorTheme.findById(id);

  if (!colorTheme) {
    throw new ApiError(
      404,
      "Color theme not found"
    );
  }

  return colorTheme;
};

export const updateColorTheme = async (
  id: string,
  data: UpdateColorThemeData
) => {
  const colorTheme =
    await ColorTheme.findById(id);

  if (!colorTheme) {
    throw new ApiError(
      404,
      "Color theme not found"
    );
  }

  if (data.name) {
    const existingColorTheme =
      await ColorTheme.findOne({
        name: data.name,
        _id: { $ne: id },
      });

    if (existingColorTheme) {
      throw new ApiError(
        409,
        "Color theme already exists",
        "COLOR_THEME_EXISTS"
      );
    }
  }

  Object.assign(colorTheme, data);

  return await colorTheme.save();
};

export const deleteColorTheme = async (
  id: string
) => {
  const colorTheme =
    await ColorTheme.findById(id);

  if (!colorTheme) {
    throw new ApiError(
      404,
      "Color theme not found"
    );
  }

  await colorTheme.deleteOne();

  return colorTheme;
};