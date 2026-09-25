import { z } from "zod";

export const createContactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .email("Please enter a valid email address"),

  telephone: z
    .string()
    .max(20, "Telephone number cannot exceed 20 characters")
    .optional(),

  subject: z
    .string()
    .max(200, "Subject cannot exceed 200 characters")
    .optional(),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
});

export type CreateContactInput = z.infer<
  typeof createContactSchema
>;