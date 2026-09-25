
import { z } from "zod";

// Create Catalog Item
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
    .number()
    .min(0, "Starting price cannot be negative"),

  materials: z.array(z.string()),

  colorThemes: z.array(z.string()),

  image: z.any().refine(
    (files) => files?.length === 1,
    "Catalog item image is required"
  ),
});

export type CatalogItemFormData =
  z.infer<typeof createCatalogItemSchema>;


// Update Catalog Item
export const updateCatalogItemSchema = z.object({
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
    .number()
    .min(0, "Starting price cannot be negative"),

  materials: z.array(z.string()),

  colorThemes: z.array(z.string()),

  // Image is optional while editing
  image: z.any().optional(),
});

export type UpdateCatalogItemFormData =
  z.infer<typeof updateCatalogItemSchema>;

