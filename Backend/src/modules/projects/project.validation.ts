
import { z } from "zod";

export const updateStatusSchema = z.object({
  status: z.enum(["planning", "in_progress", "completed"], {
    error: "Invalid status",
  }),
})

export const assignDesignerSchema = z.object({
  designerId: z.string().min(1, "Please select a designer"),
})