import {
  Request,
  Response,
  NextFunction,
} from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ParamsDictionary } from "express-serve-static-core";

export interface AuthRequest<
  P = ParamsDictionary
> extends Request<P> {
  user: {
    id: string;
    role:
      | "designer"
      | "client"
      | "admin";
  };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const token =
    authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      env.JWT_SECRET
    ) as {
      id: string;
      role:
        | "designer"
        | "client"
        | "admin";
    };

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
    });
  }
};