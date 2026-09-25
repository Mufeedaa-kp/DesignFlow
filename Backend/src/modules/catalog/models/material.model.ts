import mongoose, { Document, Schema } from "mongoose";

export interface IMaterial extends Document {
  type: string;
  name: string;
  price: number;
  images: string[];
  isActive: boolean;
}

const materialSchema = new Schema<IMaterial>(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    images: {
      type: [String],
      required: true,
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Material = mongoose.model<IMaterial>(
  "Material",
  materialSchema
);

export default Material;