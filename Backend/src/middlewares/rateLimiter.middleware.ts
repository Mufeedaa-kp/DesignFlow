import rateLimit from "express-rate-limit";

const createLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      return res.status(429).json({
        success: false,
        code: "RATE_LIMITED",
        message,
      });
    },
  });
};

export const loginLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  "Too many login attempts. Try again later."
);

export const forgotPasswordLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  "Too many reset requests. Try again later."
);

export const otpRequestLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  "Too many verification code requests. Try again later."
);

export const otpResendLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  "Too many verification code resend requests. Try again later."
);

export const otpVerifyLimiter = createLimiter(
  15 * 60 * 1000,
  20,
  "Too many verification attempts. Try again later."
);

export const googleAuthLimiter = createLimiter(
  15 * 60 * 1000,
  20,
  "Too many Google sign-in attempts. Try again later."
);
