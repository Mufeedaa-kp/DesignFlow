
import { z } from "zod";

const colorsSchema = z
  .array(
    z
      .string()
      .regex(
        /^#[0-9A-Fa-f]{6}$/,
        "Each color must be a valid HEX code"
      )
  )
  .min(2, "At least two colors are required");

export const createColorThemeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Color theme name is required"),

  colors: colorsSchema,
});

export const updateColorThemeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Color theme name is required")
    .optional(),

  colors: colorsSchema.optional(),

  isActive: z.boolean().optional(),
});
