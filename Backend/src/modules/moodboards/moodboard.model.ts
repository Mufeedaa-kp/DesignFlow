import mongoose, {
  Document,
  Schema,
  Types,
} from "mongoose";

export type MoodBoardStatus =
  | "draft"
  | "submitted"
  | "changes_requested"
  | "approved";

export type MoodBoardVersionStatus =
  | "draft"
  | "submitted"
  | "changes_requested"
  | "approved";

export interface IMoodBoardFile {
  url: string;
  publicId: string;
  fileName: string;
  fileType: "image" | "pdf";
}

const moodBoardFileSchema =
  new Schema<IMoodBoardFile>(
    {
      url: {
        type: String,
        required: true,
        trim: true,
      },

      publicId: {
        type: String,
        required: true,
        trim: true,
      },

      fileName: {
        type: String,
        required: true,
        trim: true,
      },

      fileType: {
        type: String,
        enum: ["image", "pdf"],
        required: true,
      },
    },
    {
      _id: false,
    }
  );

export interface IMoodBoardVersion {
  versionNumber: number;
  files: IMoodBoardFile[];
  designerNotes?: string;
  status: MoodBoardVersionStatus;
  clientFeedback?: string;
  clientReferenceImages?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const moodBoardVersionSchema =
  new Schema<IMoodBoardVersion>(
    {
      versionNumber: {
        type: Number,
        required: true,
        min: 1,
      },

      files: {
        type: [moodBoardFileSchema],
        required: true,
        validate: {
          validator: (
            files: IMoodBoardFile[]
          ) => files.length > 0,
          message:
            "A mood board version must contain at least one file",
        },
      },

      designerNotes: {
        type: String,
        trim: true,
        maxlength: 2000,
      },

      status: {
        type: String,
        enum: [
          "draft",
          "submitted",
          "changes_requested",
          "approved",
        ],
        default: "draft",
        required: true,
      },

      clientFeedback: {
        type: String,
        trim: true,
        maxlength: 2000,
      },

      clientReferenceImages: {
        type: [String],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

export interface IMoodBoard extends Document {
  project: Types.ObjectId;
  client: Types.ObjectId;
  designer: Types.ObjectId;
  status: MoodBoardStatus;
  versions: IMoodBoardVersion[];
  createdAt: Date;
  updatedAt: Date;
}

const moodBoardSchema =
  new Schema<IMoodBoard>(
    {
      project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        unique: true,
      },

      client: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      designer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      status: {
        type: String,
        enum: [
          "draft",
          "submitted",
          "changes_requested",
          "approved",
        ],
        default: "draft",
        required: true,
      },

      versions: {
        type: [moodBoardVersionSchema],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

export const MoodBoard =
  mongoose.model<IMoodBoard>(
    "MoodBoard",
    moodBoardSchema
  );