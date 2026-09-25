import { z } from "zod";

export const updateSettingsValidation = z.object({
  businessName: z.string().trim().min(1).optional(),
  contactEmail: z.string().trim().email().optional().or(z.literal("")),
  contactPhone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  businessHours: z.string().trim().optional(),
});