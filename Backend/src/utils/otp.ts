import crypto from "crypto";
import { env } from "../config/env";

export const OTP_LENGTH = 6;

export const generateOtp = (): string => {
  return crypto
    .randomInt(0, 1_000_000)
    .toString()
    .padStart(OTP_LENGTH, "0");
};

export const hashOtp = (email: string, otp: string): string => {
  return crypto
    .createHmac("sha256", env.OTP_SECRET)
    .update(`${email}:${otp}`)
    .digest("hex");
};

export const verifyOtpHash = (
  email: string,
  otp: string,
  storedHash: string
): boolean => {
  const candidate = Buffer.from(hashOtp(email, otp), "hex");
  const stored = Buffer.from(storedHash, "hex");

  if (candidate.length !== stored.length) {
    return false;
  }

  return crypto.timingSafeEqual(candidate, stored);
};
