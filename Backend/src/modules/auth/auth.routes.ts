import { Router } from "express"
import { register, login, refresh,logout, forgotPassword,  } from "./auth.controller"
import { validate } from "../../middlewares/validate.middleware"
import { registerValidation, loginValidation } from "./auth.validation"
import { loginLimiter,forgotPasswordLimiter } from "../../middlewares/rateLimiter.middleware"

const router = Router()

router.post("/register", validate(registerValidation), register)
router.post("/login", loginLimiter, validate(loginValidation), login)
router.post("/refresh", refresh)
router.post("/logout", logout)
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword)
// router.post("/reset-password/:token", resetPassword)

export default router
