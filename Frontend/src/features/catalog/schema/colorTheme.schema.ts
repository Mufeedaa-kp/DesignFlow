import { z } from "zod";

export const createColorThemeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Color theme name is required"),

  image: z.any().refine(
    (files) => files?.length === 1,
    "Color theme image is required"
  ),
});

export const updateColorThemeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Color theme name is required"),

  image: z.any().optional(),
});

export type ColorThemeFormValues = {
  name: string;
  image?: FileList;
};