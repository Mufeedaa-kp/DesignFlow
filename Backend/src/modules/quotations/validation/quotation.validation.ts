import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z
  .string()
  .refine(
    (value) => mongoose.Types.ObjectId.isValid(value),
    {
      message: "Invalid project ID",
    }
  );

const quotationItemSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Item description is required"),

  quantity: z
    .number()
    .min(1, "Quantity must be at least 1"),

  unitPrice: z
    .number()
    .min(0, "Unit price cannot be negative"),
});

const signatureSchema = z.object({
  signature: z
    .string()
    .min(1, "Signature is required")
    .refine(
      (value) =>
        value.startsWith("data:image/png;base64,") ||
        value.startsWith("data:image/jpeg;base64,"),
      {
        message: "Invalid signature format",
      }
    ),
});

export const createQuotationValidation =
  z.object({
    projectId: objectIdSchema,

    items: z
      .array(quotationItemSchema)
      .min(
        1,
        "Quotation must contain at least one item"
      ),

    discount: z
      .number()
      .min(
        0,
        "Discount cannot be negative"
      )
      .optional(),

    tax: z
      .number()
      .min(
        0,
        "Tax cannot be negative"
      )
      .optional(),

    notes: z
      .string()
      .trim()
      .max(
        2000,
        "Notes cannot exceed 2000 characters"
      )
      .optional(),
  });

export const updateQuotationValidation =
  z.object({
    projectId: objectIdSchema,

    items: z
      .array(quotationItemSchema)
      .min(
        1,
        "Quotation must contain at least one item"
      ),

    discount: z
      .number()
      .min(
        0,
        "Discount cannot be negative"
      )
      .optional(),

    tax: z
      .number()
      .min(
        0,
        "Tax cannot be negative"
      )
      .optional(),

    notes: z
      .string()
      .trim()
      .max(
        2000,
        "Notes cannot exceed 2000 characters"
      )
      .optional(),
  });

export const rejectQuotationValidation =
  z.object({
    rejectionReason: z
      .string()
      .trim()
      .min(
        1,
        "Rejection reason is required"
      ),
  });

export const rejectQuotationByClientValidation =
  z.object({
    rejectionReason: z
      .string()
      .trim()
      .min(
        1,
        "Rejection reason is required"
      ),
  });

export const signatureValidation =
  signatureSchema;