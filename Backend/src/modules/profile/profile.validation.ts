import { z } from "zod";
 
export const updateMyProfileValidation = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").optional(),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
});