import { z } from "zod";
 
export const createUserValidation = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "designer"], { error: "Role must be admin or designer" }),
  phone: z.string().optional(),
})
 
export const updateUserProfileValidation = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").optional(),
  phone: z.string().optional(),
  address: z.string().trim().optional(),
  profileImage: z.string().optional(),
});
 
export const updateUserStatusValidation = z.object({
  status: z.enum(["active", "inactive", "blocked"], { error: "Valid status is required" }),
});