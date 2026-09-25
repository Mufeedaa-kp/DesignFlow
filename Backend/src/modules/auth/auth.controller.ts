import { Request, Response, NextFunction } from "express"
import * as authService from "./auth.service"
import { ApiResponse } from "../../utils/ApiResponse"
import { clearRefreshCookie, setRefreshCookie } from "../../utils/cookie"
 
interface ResetPasswordParams {
  token: string;
}
 
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken, user } =
     await authService.registerUser(req.body)
     
    setRefreshCookie(res, refreshToken)
 
    return res.status(201).json(
      new ApiResponse(201, "User registered successfully", {
        accessToken, 
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          profileImage: user.profileImage,
          role: user.role,
        },
      })
    )
  } catch (error) {
    next(error)
  }
};
 
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { expectedRole, ...credentials } = req.body;
    const { accessToken, refreshToken, user } = await authService.loginUser(credentials, expectedRole);
    setRefreshCookie(res, refreshToken)
 
    return res.status(200).json(
      new ApiResponse(200, "Login successful", {
        accessToken,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          profileImage: user.profileImage,
          role: user.role,
        },
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
  req:Request,res:Response,next:NextFunction) => {
    try{
      clearRefreshCookie(res)
      return res.status(200).json(new ApiResponse(200,"Logged out successfully"))
    } catch(error){
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
 
// export const resetPassword = async (
//   req: Request<ResetPasswordParams>,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     await authService.resetPassword(
//       req.params.token,
//       req.body.password
//     );
 
//     return res.status(200).json(
//       new ApiResponse(200, "Password reset successful")
//     );
//   } catch (error) {
//     next(error);
//   }
// };