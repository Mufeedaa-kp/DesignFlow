import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required"),

  description: z
    .string()
    .trim()
    .min(1, "Category description is required"),

  image: z.any().refine(
    (files) => files?.length === 1,
    "Category image is required"
  ),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required"),

  description: z
    .string()
    .trim()
    .min(1, "Category description is required"),

  image: z.any().optional(),
});