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

  price: z.coerce
    .number()
    .min(0, "Material price cannot be negative"),
});

export const updateMaterialSchema =
  createMaterialSchema.partial();