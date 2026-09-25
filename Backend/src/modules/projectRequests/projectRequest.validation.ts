import { z } from "zod";

export const createProjectRequestValidation =
  z.object({
    projectName: z
      .string()
      .trim()
      .min(
        2,
        "Project name must be at least 2 characters"
      )
      .max(
        100,
        "Project name cannot exceed 100 characters"
      ),

    personalInfo: z
      .object({
        fullName: z.string().trim().optional(),

        email: z.string().trim().optional(),

        phone: z.string().trim().optional(),
        address: z.string().trim().optional(),
      })
      .optional(),

    category: z
      .string()
      .trim()
      .min(1, "Category is required"),

    catalogItem: z
      .string()
      .trim()
      .min(1, "Catalog item is required"),

    materials: z
      .array(z.string().trim())
      .default([]),

    colorThemes: z
      .array(z.string().trim())
      .default([]),

    measurements: z.object({
      height: z.coerce
        .number()
        .positive(
          "Height must be greater than 0"
        ),

      width: z.coerce
        .number()
        .positive(
          "Width must be greater than 0"
        ),

      unit: z.enum(["ft", "cm"]),

      squareFeet: z.coerce
        .number()
        .positive(
          "Square feet must be greater than 0"
        ),
    }),

    description: z
      .string()
      .trim()
      .min(
        10,
        "Description must be at least 10 characters"
      )
      .max(
        2000,
        "Description cannot exceed 2000 characters"
      ),

    referenceImages: z
      .array(z.string().url())
      .max(
        10,
        "Maximum 10 reference images"
      )
      .default([]),

    needBy: z
      .string()
      .trim()
      .optional(),
  });

export const rejectProjectRequestValidation =
  z.object({
    rejectionReason: z
      .string()
      .trim()
      .min(
        5,
        "Please provide a reason"
      )
      .optional(),
  });