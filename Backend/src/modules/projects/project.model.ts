import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProject extends Document {
  sourceRequest: Types.ObjectId;
  client: Types.ObjectId;
  designer?: Types.ObjectId;
  status: "planning" | "in_progress" | "completed";
  designerStatus: "unassigned" | "pending" | "accepted" | "rejected";
  designerRejectionReason?: string | null;
  createdAt: Date
  updatedAt: Date
}

const projectSchema = new Schema<IProject>(
  {
    sourceRequest: {
      type: Schema.Types.ObjectId,
      ref: "ProjectRequest",
      required: true,
      unique: true,
    },
    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    designer: { type: Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["planning", "in_progress", "completed"],
      default: "planning",
    },
    designerStatus: {
      type: String,
      enum: ["unassigned", "pending", "accepted", "rejected"],
      default: "unassigned",
    },
    designerRejectionReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", projectSchema)
