import { Request, Response, NextFunction } from "express"
import * as authService from "./auth.service"
import * as googleService from "./google.service"
import { ApiResponse } from "../../utils/ApiResponse"
import { clearRefreshCookie, setRefreshCookie } from "../../utils/cookie"
import type { IUser } from "../users/user.model"

const toAuthUser = (user: IUser) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  address: user.address,
  profileImage: user.profileImage,
  role: user.role,
})

export const legacyRegister = (_req: Request, res: Response) => {
  return res.status(410).json({
    success: false,
    message: "Registration now requires email verification. Please use the verification flow.",
    code: "OTP_REQUIRED",
  })
}

export const requestRegistrationOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await authService.requestRegistrationOtp(req.body)

    return res.status(202).json(
      new ApiResponse(202, "Verification code sent", data)
    )
  } catch (error) {
    next(error)
  }
}

export const resendRegistrationOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await authService.resendRegistrationOtp(req.body.email)

    return res.status(202).json(
      new ApiResponse(202, "Verification code resent", data)
    )
  } catch (error) {
    next(error)
  }
}

export const verifyRegistrationOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accessToken, refreshToken, user } =
      await authService.verifyRegistrationOtp(req.body.email, req.body.otp)

    setRefreshCookie(res, refreshToken)

    return res.status(201).json(
      new ApiResponse(201, "Email verified and account created", {
        accessToken,
        user: toAuthUser(user),
      })
    )
  } catch (error) {
    next(error)
  }
}

export const googleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accessToken, refreshToken, user } =
      await googleService.authenticateWithGoogle(req.body.credential)

    setRefreshCookie(res, refreshToken)

    return res.status(200).json(
      new ApiResponse(200, "Google authentication successful", {
        accessToken,
        user: toAuthUser(user),
      })
    )
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { expectedRole, ...credentials } = req.body;
    const { accessToken, refreshToken, user } = await authService.loginUser(credentials, expectedRole);
    setRefreshCookie(res, refreshToken)

    return res.status(200).json(
      new ApiResponse(200, "Login successful", {
        accessToken,
        user: toAuthUser(user),
      })
    )
  } catch (error) {
    next(error)
  }
}

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token" })
    }

    const accessToken = authService.refreshAccessToken(refreshToken);
    return res.status(200).json(new ApiResponse(200, "Token refreshed", { accessToken }))
  } catch (error) {
    next(error)
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    clearRefreshCookie(res)
    return res.status(200).json(new ApiResponse(200, "Logged out successfully"))
  } catch (error) {
    next(error)
  }
}

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.forgotPassword(req.body.email)

    return res.status(200).json(
      new ApiResponse(
        200,
        "If that email exists, a reset link has been sent"
      )
    );
  } catch (error) {
    next(error)
  }
};
