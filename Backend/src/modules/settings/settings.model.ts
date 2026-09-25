import mongoose, { Document, Schema } from "mongoose";

export interface IStudioSettings extends Document {
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  businessHours: string;
}

const settingsSchema = new Schema<IStudioSettings>(
  {
    businessName: { type: String, default: "DesignFlow Studio" },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    address: { type: String, default: "" },
    businessHours: { type: String, default: "" },
  },
  { timestamps: true }
);

export const StudioSettings = mongoose.model<IStudioSettings>("StudioSettings", settingsSchema);