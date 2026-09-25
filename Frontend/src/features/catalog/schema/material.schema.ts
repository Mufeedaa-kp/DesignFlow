import { z } from "zod";

export const createMaterialSchema = z.object({
  type: z
    .string()
    .trim()
    .min(1, "Material type is required"),

  name: z
    .string()
    .trim()
    .min(1, "Material name is required"),

  price: z
    .number()
    .min(0, "Material price cannot be negative"),

  images: z.any().refine(
    (files) => files?.length >= 1,
    "At least one material image is required"
  ),
});

export const updateMaterialSchema = z.object({
  type: z
    .string()
    .trim()
    .min(1, "Material type is required"),

  name: z
    .string()
    .trim()
    .min(1, "Material name is required"),

  price: z
    .number()
    .min(0, "Material price cannot be negative"),

  images: z.any().optional(),
});

export type MaterialFormValues = {
  type: string;
  name: string;
  price: number;
  images?: FileList;
};