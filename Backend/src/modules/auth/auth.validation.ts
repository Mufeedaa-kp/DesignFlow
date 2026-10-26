import { z } from "zod";

export const registerValidation = z.object({
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
      "Address must be at least 5 characters"
    ),

  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters"
    ),
});

export const resendOtpValidation = z.object({
  email: z
    .string()
    .trim()
    .email("Valid email is required"),
});

export const verifyOtpValidation = z.object({
  email: z
    .string()
    .trim()
    .email("Valid email is required"),

  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Verification code must be 6 digits"),
});

export const googleAuthValidation = z.object({
  credential: z
    .string()
    .trim()
    .min(20, "Google credential is required")
    .max(10000, "Google credential is too large"),
});

export const loginValidation = z.object({
  email: z
    .string()
    .trim()
    .email("Valid email is required"),

  password: z
    .string()
    .min(1, "Password is required"),


  expectedRole: z
    .enum(["admin", "designer", "client"])
    .optional(),
});
