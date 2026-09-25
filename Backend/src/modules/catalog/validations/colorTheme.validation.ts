import { z } from "zod";

export const createColorThemeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Color theme name is required"),
});

export const updateColorThemeSchema =
  createColorThemeSchema.partial();