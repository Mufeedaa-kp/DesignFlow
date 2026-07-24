import { z } from "zod";

export const projectRequestSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Please provide more detail"),
  propertyType: z.enum(["apartment", "villa", "office", "other"]),
  budgetMin: z.coerce.number().min(0).optional(),
  budgetMax: z.coerce.number().min(0).optional(),
  preferredTimeline: z.string().optional(),
  location: z.string().min(1, "Location is required"),
}).refine(
  (data) => !data.budgetMax || !data.budgetMin || data.budgetMax >= data.budgetMin,
  { message: "Max budget must be greater than min budget", path: ["budgetMax"] }
);

export type ProjectRequestFormValues = z.infer<typeof projectRequestSchema>;