import mongoose, { Document, Schema, Types } from "mongoose";

export type NotificationType =
  | "PROJECT_REQUEST_SUBMITTED"
  | "PROJECT_REQUEST_REJECTED"
  | "DESIGNER_ASSIGNED"
  | "PROJECT_ASSIGNED"
  | "DESIGNER_ASSIGNMENT_ACCEPTED"
  | "DESIGNER_ASSIGNMENT_REJECTED"
  | "QUOTATION_SUBMITTED"
  | "QUOTATION_APPROVED"
  | "QUOTATION_ADMIN_REJECTED"
  | "QUOTATION_ACCEPTED"
  | "QUOTATION_REJECTED"
  | "MOOD_BOARD_SUBMITTED"
  | "MOOD_BOARD_CHANGES_REQUESTED"
  | "MOOD_BOARD_APPROVED"
  | "PROJECT_STATUS_UPDATED"
  | "PROJECT_REQUEST_APPROVED"
  | "NEW_MESSAGE";

export interface INotification extends Document {
  recipient: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  project?: Types.ObjectId;
  link?: string; // NEW
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "PROJECT_REQUEST_SUBMITTED",
        "PROJECT_REQUEST_REJECTED",
        "DESIGNER_ASSIGNED",
        "PROJECT_ASSIGNED",
        "DESIGNER_ASSIGNMENT_ACCEPTED",
        "DESIGNER_ASSIGNMENT_REJECTED",
        "QUOTATION_SUBMITTED",
        "QUOTATION_APPROVED",
        "QUOTATION_ADMIN_REJECTED",
        "QUOTATION_ACCEPTED",
        "QUOTATION_REJECTED",
        "MOOD_BOARD_SUBMITTED",
        "MOOD_BOARD_CHANGES_REQUESTED",
        "MOOD_BOARD_APPROVED",
        "PROJECT_STATUS_UPDATED",
        "PROJECT_REQUEST_APPROVED",
        "NEW_MESSAGE",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },

    // NEW
    link: {
      type: String,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);