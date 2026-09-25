import { z } from "zod";

export const moodBoardFormSchema = z.object({
  designerNotes: z
    .string()
    .trim()
    .max(
      2000,
      "Designer notes cannot exceed 2000 characters"
    )
    .optional(),
});

export type MoodBoardFormValues = z.infer<
  typeof moodBoardFormSchema
>;