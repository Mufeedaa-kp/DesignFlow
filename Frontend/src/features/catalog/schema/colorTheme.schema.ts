
import { z } from "zod";

const colorsSchema = z
  .array(
    z
      .string()
      .regex(
        /^#[0-9A-Fa-f]{6}$/,
        "Enter a valid HEX color (example: #234C96)"
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

export const updateColorThemeSchema = createColorThemeSchema;

export type ColorThemeFormValues = {
  name: string;
  colors: string[];
};
