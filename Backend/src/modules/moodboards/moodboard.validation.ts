import { z } from "zod";

export const createMoodBoardSchema = z.object({
  projectId: z
    .string()
    .trim()
    .min(1, "Project is required"),

  designerNotes: z
    .string()
    .trim()
    .max(
      2000,
      "Designer notes cannot exceed 2000 characters"
    )
    .optional(),
});

export const addMoodBoardVersionSchema = z.object({
  designerNotes: z
    .string()
    .trim()
    .max(
      2000,
      "Designer notes cannot exceed 2000 characters"
    )
    .optional(),
});

export const requestMoodBoardChangesSchema = z.object({
  clientFeedback: z
    .string()
    .trim()
    .min(1, "Change request is required")
    .max(
      2000,
      "Change request cannot exceed 2000 characters"
    ),
});

export type CreateMoodBoardInput = z.infer<
  typeof createMoodBoardSchema
>;

export type AddMoodBoardVersionInput = z.infer<
  typeof addMoodBoardVersionSchema
>;

export type RequestMoodBoardChangesInput = z.infer<
  typeof requestMoodBoardChangesSchema
>;