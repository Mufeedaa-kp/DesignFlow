import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICatalogItem extends Document {
  category: Types.ObjectId;
  name: string;
  description: string;
  image: string;
  startingPrice: number;
  materials: Types.ObjectId[];
  colorThemes: Types.ObjectId[];
  isActive: boolean;
}

const catalogItemSchema = new Schema<ICatalogItem>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    startingPrice: {
      type: Number,
      required: true,
      min: 0,
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

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const CatalogItem = mongoose.model<ICatalogItem>(
  "CatalogItem",
  catalogItemSchema
);

export default CatalogItem;