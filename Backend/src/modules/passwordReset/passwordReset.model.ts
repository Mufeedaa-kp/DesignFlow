import mongoose, {
  Document,
  Schema,
  Types,
} from "mongoose";

export interface IPasswordReset extends Document {
  user: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const passwordResetSchema =
  new Schema<IPasswordReset>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      tokenHash: {
        type: String,
        required: true,
        unique: true,
      },

      expiresAt: {
        type: Date,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

export const PasswordReset =
  mongoose.model<IPasswordReset>(
    "PasswordReset",
    passwordResetSchema
  );