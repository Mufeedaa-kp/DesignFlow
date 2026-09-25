
import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface TokenPayload {
  id: string;
  role: string;
}

export const generateAccessToken = (userId: string, role: string): string => {
  const payload: TokenPayload = { id: userId, role };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN } as jwt.SignOptions);
};

export const generateRefreshToken = (userId: string, role: string): string => {
  const payload: TokenPayload = { id: userId, role };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);
};