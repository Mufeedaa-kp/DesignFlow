import bcrypt from "bcrypt"
import crypto from "crypto"
import { User } from "../users/user.model"
import { ApiError } from "../../utils/ApiError"
import { generateAccessToken,generateRefreshToken } from "../../utils/generateToken"
import jwt from "jsonwebtoken"
import { env } from "../../config/env";
import { sendEmail } from "../../utils/sendEmail";
import { PasswordReset } from "../passwordReset/passwordReset.model";


export const registerUser = async (data: any) => {
  const { fullName, email, password, phone , address } = data

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw new ApiError(400, "Email already registered")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    phone,
    address,
    role:"client"
  })

  const accessToken = generateAccessToken(user._id.toString(),user.role)
  const refreshToken = generateRefreshToken(user._id.toString(),user.role)

  return {accessToken,refreshToken,user}
  
}

export const loginUser = async (data: any, expectedRole?: "admin" | "designer" | "client") => {
  const { email, password } = data

  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(401, "Invalid credentials")
  }
  if (user.status !== "active") {
    throw new ApiError(403, "Account is inactive or blocked")
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials")
  }
  

  if (expectedRole && user.role !== expectedRole) {
    throw new ApiError(403, "This login page is not for your account type")
  }

  const accessToken = generateAccessToken(user._id.toString(), user.role)
  const refreshToken = generateRefreshToken(user._id.toString(), user.role)

  return { accessToken, refreshToken, user }
}

export const refreshAccessToken = (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { id: string; role: string }
    const accessToken = generateAccessToken(decoded.id, decoded.role)
    return accessToken
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token")
  }
}

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email })
  if (!user) return

  const rawToken = crypto.randomBytes(32).toString("hex")
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  await PasswordReset.create({
    user: user._id,
    tokenHash: hashedToken,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  const resetUrl = `${env.CLIENT_URL}/reset-password/${rawToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your DesignFlow password",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
  });
};

// export const resetPassword = async (token: string, password: string) => {
//   const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//   const resetRecord = await PasswordReset.findOne({
//     tokenHash: hashedToken,
//     expiresAt: { $gt: new Date() },
//   });

//   if (!resetRecord) {
//     throw new ApiError(400, "Reset link is invalid or has expired");
//   }

//   const user = await User.findById(resetRecord.user);
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   user.password = await bcrypt.hash(password, 10);
//   await user.save();

//   await PasswordReset.deleteOne({ _id: resetRecord._id }); 
// };