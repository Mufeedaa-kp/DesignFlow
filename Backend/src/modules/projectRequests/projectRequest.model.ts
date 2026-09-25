import mongoose, {
  Document,
  Schema,
  Types,
} from "mongoose";

export interface IProjectRequest extends Document {
  client: Types.ObjectId;

  projectName: string;

  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };

  category: Types.ObjectId;

  catalogItem: Types.ObjectId;

  materials: Types.ObjectId[];

  colorThemes: Types.ObjectId[];

measurements: {
  height: number;
  width: number;
  unit: "ft" | "cm";
  squareFeet: number;
}

  description: string;

  referenceImages: string[];

  needBy?: string;

  estimatedTotal: number;

  status:
    | "pending"
    | "approved"
    | "rejected";

  rejectionReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

const projectRequestSchema =
  new Schema<IProjectRequest>(
    {
      client: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      projectName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
      },

      personalInfo: {
        fullName: {
          type: String,
          required: true,
          trim: true,
        },

        email: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },

        phone: {
          type: String,
          required: true,
          trim: true,
        },

        address: {
          type: String,
          required: true,
          trim: true,
        },
      },

      category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },

      catalogItem: {
        type: Schema.Types.ObjectId,
        ref: "CatalogItem",
        required: true,
      },

      materials: [
        {
          type: Schema.Types.ObjectId,
          ref: "Material",
        },
      ],

      colorThemes: [
        {
          type: Schema.Types.ObjectId,
          ref: "ColorTheme",
        },
      ],

      measurements: {
        height: {
          type: Number,
          required: true,
          min: 0,
        },

        width: {
          type: Number,
          required: true,
          min: 0,
        },


  unit: {
    type: String,
    enum: ["ft", "cm"],
    required: true,
  },

        squareFeet: {
          type: Number,
          required: true,
          min: 0,
        },
      },

      description: {
        type: String,
        required: true,
        trim: true,
      },

      referenceImages: {
        type: [String],
        default: [],
      },

      needBy: {
        type: String,
        trim: true,
      },

      estimatedTotal: {
        type: Number,
        default: 0,
        min: 0,
      },

      status: {
        type: String,
        enum: [
          "pending",
          "approved",
          "rejected",
        ],
        default: "pending",
      },

      rejectionReason: {
        type: String,
        trim: true,
      },
    },

    {
      timestamps: true,
    }
  );

export const ProjectRequest =
  mongoose.model<IProjectRequest>(
    "ProjectRequest",
    projectRequestSchema
  );