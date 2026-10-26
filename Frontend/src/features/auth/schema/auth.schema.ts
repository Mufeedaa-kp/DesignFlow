import { z } from "zod";

export const loginSchema = z.object({
  email: z
  .string()
  .trim()
  .email("Valid email is required"),
  password: z
  .string()
  .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .email("Valid email is required"),

  phone: z
    .string()
    .trim()
    .min(7, "Valid phone number is required"),

  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});
export const otpVerificationSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Valid email is required"),

  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit verification code"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type OtpVerificationFormValues = z.infer<typeof otpVerificationSchema>;