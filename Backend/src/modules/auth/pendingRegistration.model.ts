import mongoose, { Document, Schema } from "mongoose";

export interface IPendingRegistration extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  address?: string;
  otpHash: string;
  otpExpiresAt: Date;
  attempts: number;
  resendAvailableAt: Date;
  sendCount: number;
  sendWindowStartedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const pendingRegistrationSchema = new Schema<IPendingRegistration>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    otpHash: { type: String, required: true, select: false },
    otpExpiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0, min: 0 },
    resendAvailableAt: { type: Date, required: true },
    sendCount: { type: Number, default: 0, min: 0 },
    sendWindowStartedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

pendingRegistrationSchema.index({ email: 1 }, { unique: true });
pendingRegistrationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: "pending_registration_ttl" }
);

export const PendingRegistration = mongoose.model<IPendingRegistration>(
  "PendingRegistration",
  pendingRegistrationSchema
);
