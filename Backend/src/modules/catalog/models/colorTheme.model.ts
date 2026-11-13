
import mongoose, { Schema, Document } from "mongoose";

export interface IColorTheme extends Document {
  name: string;
  colors: string[];
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
    colors: {
      type: [String],
      required: true,
      validate: {
        validator: (colors: string[]) =>
          colors.length >= 2 &&
          colors.every((color) => /^#[0-9A-Fa-f]{6}$/.test(color)),
        message: "Provide at least two valid HEX colors.",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ColorTheme = mongoose.model<IColorTheme>(
  "ColorTheme",
  colorThemeSchema
);

export default ColorTheme;
