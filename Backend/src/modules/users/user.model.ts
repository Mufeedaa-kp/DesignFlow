import mongoose, { Document, Schema } from "mongoose"
import { ROLES } from "../../constants/roles"

export interface IUser extends Document {
  fullName: string
  email: string
  password: string
  phone?: string
  address?:string,
  role: "admin" | "designer" | "client"
  status: "active" | "inactive" | "blocked"
  profileImage?: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String },
    address: { type:String,trim:true },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CLIENT,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
    profileImage: { type: String, default: "" },
  },
  { timestamps: true } 
)

export const User = mongoose.model<IUser>("User", userSchema)