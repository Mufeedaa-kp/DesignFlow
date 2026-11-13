import api from "../../../services/api"

export interface AuthResponseData {
  accessToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
    profileImage?: string;
    role: "admin" | "designer" | "client"
  }
}

export interface RegistrationOtpData {
  email: string;
  expiresAt: string;
  resendAfterSeconds: number;
}

export const requestRegistrationOtp = async (data: {
  fullName: string
  email: string
  phone: string
  address: string
  password: string
}) => {
  const res = await api.post("/auth/register/request-otp", data)
  return res.data.data as RegistrationOtpData
}

export const resendRegistrationOtp = async (email: string) => {
  const res = await api.post("/auth/register/resend", { email })
  return res.data.data as RegistrationOtpData
}

export const verifyRegistrationOtp = async (data: {
  email: string
  otp: string
}) => {
  const res = await api.post("/auth/register/verify", data)
  return res.data.data as AuthResponseData
}

export const loginUser = async (
  data: { email: string; password: string } & { expectedRole?: "admin" | "designer" | "client" }
) => {
  const res = await api.post("/auth/login", data)
  return res.data.data as AuthResponseData
}

export const googleLogin = async (credential: string) => {
  const res = await api.post("/auth/google", { credential })
  return res.data.data as AuthResponseData
}
