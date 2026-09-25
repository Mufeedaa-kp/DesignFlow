import mongoose, { Document, Schema } from "mongoose";

export interface IColorTheme extends Document {
  name: string;
  image: string;
  isActive: boolean;
}

const colorThemeSchema = new Schema<IColorTheme>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
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

const ColorTheme = mongoose.model<IColorTheme>(
  "ColorTheme",
  colorThemeSchema
);

export default ColorTheme;