import { z } from "zod";

const quotationItemSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Item description is required"),

  quantity: z
    .number({
      error: "Quantity is required",
    })
    .min(1, "Quantity must be at least 1"),

  unitPrice: z
    .number({
      error: "Unit price is required",
    })
    .min(0, "Unit price cannot be negative"),
});

export const quotationSchema = z.object({
  projectId: z
    .string()
    .min(1, "Project is required"),

  items: z
    .array(quotationItemSchema)
    .min(1, "Add at least one quotation item"),

  discount: z
    .number({
      error: "Discount must be a number",
    })
    .min(0, "Discount cannot be negative"),

  tax: z
    .number({
      error: "Tax must be a number",
    })
    .min(0, "Tax cannot be negative"),

  notes: z
    .string()
    .trim()
    .max(
      2000,
      "Notes cannot exceed 2000 characters"
    )
    .optional(),
});

export const quotationRejectionSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(1, "Rejection reason is required")
    .max(
      1000,
      "Rejection reason cannot exceed 1000 characters"
    ),
});

export type QuotationFormValues =
  z.infer<typeof quotationSchema>;

export type QuotationRejectionFormValues =
  z.infer<typeof quotationRejectionSchema>;