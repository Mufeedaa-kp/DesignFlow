import { Router } from "express"
import {
  forgotPassword,
  googleAuth,
  legacyRegister,
  login,
  logout,
  refresh,
  requestRegistrationOtp,
  resendRegistrationOtp,
  verifyRegistrationOtp,
} from "./auth.controller"
import { validate } from "../../middlewares/validate.middleware"
import {
  googleAuthValidation,
  loginValidation,
  registerValidation,
  resendOtpValidation,
  verifyOtpValidation,
} from "./auth.validation"
import {
  forgotPasswordLimiter,
  googleAuthLimiter,
  loginLimiter,
  otpRequestLimiter,
  otpResendLimiter,
  otpVerifyLimiter,
} from "../../middlewares/rateLimiter.middleware"

const router = Router()

router.post(
  "/register/request-otp",
  otpRequestLimiter,
  validate(registerValidation),
  requestRegistrationOtp
)
router.post(
  "/register/resend",
  otpResendLimiter,
  validate(resendOtpValidation),
  resendRegistrationOtp
)
router.post(
  "/register/verify",
  otpVerifyLimiter,
  validate(verifyOtpValidation),
  verifyRegistrationOtp
)
router.post(
  "/google",
  googleAuthLimiter,
  validate(googleAuthValidation),
  googleAuth
)
router.post("/register", legacyRegister)
router.post("/login", loginLimiter, validate(loginValidation), login)
router.post("/refresh", refresh)
router.post("/logout", logout)
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword)

export default router
