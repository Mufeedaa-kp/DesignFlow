import { Response } from "express";
import { env } from "../config/env";

export const REFRESH_COOKIE_NAME = "refreshToken";

export const setRefreshCookie = (res: Response, token: string) => {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production", 
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    path: "/api/auth/refresh", 
  })
}

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie(REFRESH_COOKIE_NAME, 
    { path: "/api/auth/refresh" }
  );
};