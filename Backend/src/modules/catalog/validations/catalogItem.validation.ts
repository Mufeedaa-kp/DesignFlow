import { z } from "zod";

export const createCatalogItemSchema = z.object({
  category: z
    .string()
    .trim()
    .min(1, "Category is required"),

  name: z
    .string()
    .trim()
    .min(1, "Catalog item name is required"),

  description: z
    .string()
    .trim()
    .min(1, "Catalog item description is required"),

  startingPrice: z
    .coerce
    .number()
    .min(0, "Starting price cannot be negative"),

  materials: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return [];

      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }),

  colorThemes: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return [];

      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }),
});

export const updateCatalogItemSchema =
  createCatalogItemSchema.partial();