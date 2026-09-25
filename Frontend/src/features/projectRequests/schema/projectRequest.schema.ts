import { z } from "zod";

export const projectRequestSchema = z.object({
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

  personalInfo: z.object({
    fullName: z
      .string()
      .trim()
      .min(
        2,
        "Full name must be at least 2 characters"
      ),

    email: z
      .string()
      .trim()
      .email("Valid email is required"),

    phone: z
      .string()
      .trim()
      .min(
        7,
        "Valid phone number is required"
      ),

    address: z
      .string()
      .trim()
      .min(
        5,
        "Address is required"
      ),
  }),

  category: z
    .string()
    .min(1, "Please select a category"),

  catalogItem: z
    .string()
    .min(1, "Please select a catalog item"),

  materials: z.array(z.string()),

  colorThemes: z.array(z.string()),

measurements: z.object({
  height: z.coerce
    .number()
    .positive("Height must be greater than 0"),

  width: z.coerce
    .number()
    .positive("Width must be greater than 0"),

  unit: z.enum(["ft", "cm"]),

  squareFeet: z.coerce
    .number()
    .positive("Square feet must be greater than 0"),
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
    ),

 needBy: z
  .string()
  .optional()
  .refine(
    (date) => {
      if (!date) return true;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedDate = new Date(`${date}T00:00:00`);

      return selectedDate >= today;
    },
    {
      message: "Required by date cannot be in the past",
    }
  ),
});

export type ProjectRequestFormValues =
  z.infer<typeof projectRequestSchema>;


export const projectRequestRequirementsSchema = z.object({
  projectName: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be 100 characters or less"),

  measurements: z.object({
    height: z
      .number()
      .positive("Height must be greater than 0"),

    width: z
      .number()
      .positive("Width must be greater than 0"),

    unit: z.enum(["ft", "cm"]),

    squareFeet: z
      .number()
      .positive("Square feet must be greater than 0"),
  }),

  description: z
    .string()
    .min(1, "Project description is required")
    .max(
      2000,
      "Description must be 2000 characters or less"
    ),

  needBy: z
    .string()
    .optional(),
});
export type ProjectRequestRequirementsFormValues =
  z.infer<typeof projectRequestRequirementsSchema>;