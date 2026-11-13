import bcrypt from "bcrypt"
import crypto from "crypto"
import mongoose from "mongoose"
import { User, type IUser } from "../users/user.model"
import { ApiError } from "../../utils/ApiError"
import { generateAccessToken, generateRefreshToken } from "../../utils/generateToken"
import jwt from "jsonwebtoken"
import { env } from "../../config/env";
import { sendEmail } from "../../utils/sendEmail";
import { PasswordReset } from "../passwordReset/passwordReset.model";
import { PendingRegistration, type IPendingRegistration } from "./pendingRegistration.model";
import { generateOtp, hashOtp, verifyOtpHash } from "../../utils/otp";
import { normalizeEmail } from "../../utils/normalizeEmail";
import { isDuplicateKeyError } from "../../utils/mongoErrors";
import {
  BCRYPT_ROUNDS,
  OTP_EXPIRY_MINUTES,
  OTP_HOURLY_WINDOW_MS,
  OTP_MAX_ATTEMPTS,
  OTP_MAX_SENDS_PER_HOUR,
  OTP_PENDING_TTL_MINUTES,
  OTP_RESEND_COOLDOWN_SECONDS,
} from "./auth.constants";

interface RegistrationDetailsInput {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const getRetryAfterSeconds = (target: Date): number => {
  return Math.max(0, Math.ceil((target.getTime() - Date.now()) / 1000));
};

const buildOtpEmail = (otp: string) => {
  return {
    subject: "Your DesignFlow verification code",
    html: `
      <div style="font-family: Arial, sans-serif; color: #2f2a26; line-height: 1.6;">
        <h2 style="margin: 0 0 16px;">Verify your DesignFlow email</h2>
        <p>Use this code to finish creating your DesignFlow account:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 24px 0;">${otp}</p>
        <p>This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
        <p>If you did not request this code, you can ignore this email.</p>
      </div>
    `,
  };
};

const getPendingSendState = (
  pending: Pick<IPendingRegistration, "sendCount" | "sendWindowStartedAt">,
  now: Date
) => {
  const windowEndsAt = new Date(
    pending.sendWindowStartedAt.getTime() + OTP_HOURLY_WINDOW_MS
  );

  if (now >= windowEndsAt) {
    return {
      sendCount: 1,
      sendWindowStartedAt: now,
    };
  }

  if (pending.sendCount >= OTP_MAX_SENDS_PER_HOUR) {
    throw new ApiError(
      429,
      "Too many verification codes requested. Try again later.",
      "OTP_EMAIL_LIMIT_REACHED",
      { retryAfterSeconds: getRetryAfterSeconds(windowEndsAt) }
    );
  }

  return {
    sendCount: pending.sendCount + 1,
    sendWindowStartedAt: pending.sendWindowStartedAt,
  };
};

const assertNotInCooldown = (
  pending: Pick<IPendingRegistration, "resendAvailableAt">,
  now: Date
) => {
  if (pending.resendAvailableAt.getTime() > now.getTime()) {
    throw new ApiError(
      429,
      "Please wait before requesting another verification code.",
      "OTP_RESEND_COOLDOWN",
      { retryAfterSeconds: getRetryAfterSeconds(pending.resendAvailableAt) }
    );
  }
};

const issueTokens = (user: IUser) => {
  if (user.status !== "active") {
    throw new ApiError(403, "Account is inactive or blocked", "ACCOUNT_INACTIVE");
  }

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString(), user.role);

  return { accessToken, refreshToken, user };
};

export const requestRegistrationOtp = async (
  data: RegistrationDetailsInput
) => {
  const fullName = data.fullName.trim();
  const email = normalizeEmail(data.email);
  const phone = data.phone.trim();
  const address = data.address.trim();
  const now = new Date();

  const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
  const otp = generateOtp();
  const otpHash = hashOtp(email, otp);
  const otpExpiresAt = new Date(
    now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000
  );
  const resendAvailableAt = new Date(
    now.getTime() + OTP_RESEND_COOLDOWN_SECONDS * 1000
  );
  const expiresAt = new Date(
    now.getTime() + OTP_PENDING_TTL_MINUTES * 60 * 1000
  );

  const pendingResult: { record: IPendingRegistration | null } = {
    record: null,
  };
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const existingUser = await User.findOne({ email })
        .select("_id")
        .session(session);

      if (existingUser) {
        throw new ApiError(
          409,
          "Email already registered",
          "EMAIL_ALREADY_EXISTS"
        );
      }

      const existingPending = await PendingRegistration.findOne({ email }).session(
        session
      );

      if (existingPending) {
        if (existingPending.expiresAt.getTime() > now.getTime()) {
          assertNotInCooldown(existingPending, now);
        }

        const sendState =
          existingPending.expiresAt.getTime() > now.getTime()
            ? getPendingSendState(existingPending, now)
            : { sendCount: 1, sendWindowStartedAt: now };

        pendingResult.record = await PendingRegistration.findByIdAndUpdate(
          existingPending._id,
          {
            $set: {
              fullName,
              passwordHash,
              phone,
              address,
              otpHash,
              otpExpiresAt,
              attempts: 0,
              resendAvailableAt,
              sendCount: sendState.sendCount,
              sendWindowStartedAt: sendState.sendWindowStartedAt,
              expiresAt,
            },
          },
          { new: true, session }
        );
      } else {
        const [created] = await PendingRegistration.create(
          [
            {
              fullName,
              email,
              passwordHash,
              phone,
              address,
              otpHash,
              otpExpiresAt,
              attempts: 0,
              resendAvailableAt,
              sendCount: 1,
              sendWindowStartedAt: now,
              expiresAt,
            },
          ],
          { session }
        );

        pendingResult.record = created;
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (isDuplicateKeyError(error)) {
      throw new ApiError(409, "Email already registered", "EMAIL_ALREADY_EXISTS");
    }

    throw new ApiError(
      503,
      "Unable to start registration. Please try again.",
      "REGISTRATION_FAILED"
    );
  } finally {
    await session.endSession();
  }

  const pending = pendingResult.record;

  if (!pending) {
    throw new ApiError(
      503,
      "Unable to start registration. Please try again.",
      "REGISTRATION_FAILED"
    );
  }

  const emailSent = await sendEmail({
    to: email,
    ...buildOtpEmail(otp),
  });

  if (!emailSent) {
    await PendingRegistration.deleteOne({
      _id: pending._id,
      otpHash,
    }).catch(() => undefined);

    throw new ApiError(
      503,
      "Unable to send the verification code. Please try again.",
      "OTP_EMAIL_FAILED"
    );
  }

  return {
    email,
    expiresAt: otpExpiresAt.toISOString(),
    resendAfterSeconds: OTP_RESEND_COOLDOWN_SECONDS,
  };
};

export const resendRegistrationOtp = async (emailInput: string) => {
  const email = normalizeEmail(emailInput);
  const now = new Date();
  const otp = generateOtp();
  const otpHash = hashOtp(email, otp);
  const otpExpiresAt = new Date(
    now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000
  );
  const resendAvailableAt = new Date(
    now.getTime() + OTP_RESEND_COOLDOWN_SECONDS * 1000
  );
  const expiresAt = new Date(
    now.getTime() + OTP_PENDING_TTL_MINUTES * 60 * 1000
  );

  const pendingResult: { record: IPendingRegistration | null } = {
    record: null,
  };
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const existingUser = await User.findOne({ email })
        .select("_id")
        .session(session);

      if (existingUser) {
        throw new ApiError(
          409,
          "Email already registered",
          "EMAIL_ALREADY_EXISTS"
        );
      }

      const existingPending = await PendingRegistration.findOne({ email }).session(
        session
      );

      if (
        !existingPending ||
        existingPending.expiresAt.getTime() <= now.getTime()
      ) {
        throw new ApiError(
          400,
          "Registration has expired. Please start again.",
          "OTP_EXPIRED"
        );
      }

      assertNotInCooldown(existingPending, now);
      const sendState = getPendingSendState(existingPending, now);

      pendingResult.record = await PendingRegistration.findByIdAndUpdate(
        existingPending._id,
        {
          $set: {
            otpHash,
            otpExpiresAt,
            attempts: 0,
            resendAvailableAt,
            sendCount: sendState.sendCount,
            sendWindowStartedAt: sendState.sendWindowStartedAt,
            expiresAt,
          },
        },
        { new: true, session }
      );
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (isDuplicateKeyError(error)) {
      throw new ApiError(409, "Email already registered", "EMAIL_ALREADY_EXISTS");
    }

    throw new ApiError(
      503,
      "Unable to resend the verification code. Please try again.",
      "REGISTRATION_FAILED"
    );
  } finally {
    await session.endSession();
  }

  const pending = pendingResult.record;

  if (!pending) {
    throw new ApiError(
      503,
      "Unable to resend the verification code. Please try again.",
      "REGISTRATION_FAILED"
    );
  }

  const emailSent = await sendEmail({
    to: email,
    ...buildOtpEmail(otp),
  });

  if (!emailSent) {
    throw new ApiError(
      503,
      "Unable to send the verification code. Please try again.",
      "OTP_EMAIL_FAILED"
    );
  }

  return {
    email,
    expiresAt: otpExpiresAt.toISOString(),
    resendAfterSeconds: OTP_RESEND_COOLDOWN_SECONDS,
  };
};

export const verifyRegistrationOtp = async (
  emailInput: string,
  otp: string
) => {
  const email = normalizeEmail(emailInput);
  const pending = await PendingRegistration.findOne({ email }).select(
    "+passwordHash +otpHash"
  );

  if (!pending) {
    throw new ApiError(
      400,
      "Verification code has expired. Please start again.",
      "OTP_EXPIRED"
    );
  }

  const now = new Date();

  if (
    pending.expiresAt.getTime() <= now.getTime() ||
    pending.otpExpiresAt.getTime() <= now.getTime()
  ) {
    throw new ApiError(
      400,
      "Verification code has expired. Request a new code.",
      "OTP_EXPIRED"
    );
  }

  if (pending.attempts >= OTP_MAX_ATTEMPTS) {
    throw new ApiError(
      429,
      "Too many incorrect attempts. Request a new code.",
      "OTP_ATTEMPTS_EXCEEDED",
      { attemptsRemaining: 0 }
    );
  }

  if (!verifyOtpHash(email, otp, pending.otpHash)) {
    const updated = await PendingRegistration.findOneAndUpdate(
      {
        _id: pending._id,
        attempts: { $lt: OTP_MAX_ATTEMPTS },
      },
      { $inc: { attempts: 1 } },
      { new: true }
    );

    if (!updated) {
      throw new ApiError(
        429,
        "Too many incorrect attempts. Request a new code.",
        "OTP_ATTEMPTS_EXCEEDED",
        { attemptsRemaining: 0 }
      );
    }

    const attemptsRemaining = Math.max(
      0,
      OTP_MAX_ATTEMPTS - updated.attempts
    );

    if (attemptsRemaining === 0) {
      throw new ApiError(
        429,
        "Too many incorrect attempts. Request a new code.",
        "OTP_ATTEMPTS_EXCEEDED",
        { attemptsRemaining: 0 }
      );
    }

    throw new ApiError(
      400,
      "Incorrect verification code.",
      "OTP_INVALID",
      { attemptsRemaining }
    );
  }

  const userResult: { record: IUser | null } = { record: null };
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const currentPending = await PendingRegistration.findOne({
        _id: pending._id,
      })
        .select("+passwordHash +otpHash")
        .session(session);

      if (!currentPending) {
        throw new ApiError(
          400,
          "Verification code has expired. Please start again.",
          "OTP_EXPIRED"
        );
      }

      const currentTime = new Date();

      if (
        currentPending.expiresAt.getTime() <= currentTime.getTime() ||
        currentPending.otpExpiresAt.getTime() <= currentTime.getTime()
      ) {
        throw new ApiError(
          400,
          "Verification code has expired. Request a new code.",
          "OTP_EXPIRED"
        );
      }

      if (currentPending.attempts >= OTP_MAX_ATTEMPTS) {
        throw new ApiError(
          429,
          "Too many incorrect attempts. Request a new code.",
          "OTP_ATTEMPTS_EXCEEDED",
          { attemptsRemaining: 0 }
        );
      }

      if (!verifyOtpHash(email, otp, currentPending.otpHash)) {
        throw new ApiError(
          400,
          "Incorrect verification code.",
          "OTP_INVALID"
        );
      }

      const existingUser = await User.findOne({ email })
        .select("_id")
        .session(session);

      if (existingUser) {
        throw new ApiError(
          409,
          "Email already registered",
          "EMAIL_ALREADY_EXISTS"
        );
      }

      const [created] = await User.create(
        [
          {
            fullName: currentPending.fullName,
            email: currentPending.email,
            password: currentPending.passwordHash,
            phone: currentPending.phone,
            address: currentPending.address,
            role: "client",
            status: "active",
            emailVerifiedAt: currentTime,
          },
        ],
        { session }
      );

      userResult.record = created;

      await PendingRegistration.deleteOne(
        { _id: currentPending._id },
        { session }
      );
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (isDuplicateKeyError(error)) {
      throw new ApiError(409, "Email already registered", "EMAIL_ALREADY_EXISTS");
    }

    throw new ApiError(
      503,
      "Unable to complete registration. Please try again.",
      "REGISTRATION_FAILED"
    );
  } finally {
    await session.endSession();
  }

  const user = userResult.record;

  if (!user) {
    throw new ApiError(
      503,
      "Unable to complete registration. Please try again.",
      "REGISTRATION_FAILED"
    );
  }

  return issueTokens(user);
};

export const loginUser = async (
  data: LoginInput,
  expectedRole?: "admin" | "designer" | "client"
) => {
  const email = normalizeEmail(data.email);
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.status !== "active") {
    throw new ApiError(403, "Account is inactive or blocked");
  }

  if (!user.password) {
    throw new ApiError(
      401,
      "This account uses Google Sign-In. Continue with Google instead.",
      "PASSWORD_LOGIN_UNAVAILABLE"
    );
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (expectedRole && user.role !== expectedRole) {
    throw new ApiError(403, "This login page is not for your account type");
  }

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString(), user.role);

  return { accessToken, refreshToken, user };
};

export const refreshAccessToken = (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { id: string; role: string }
    const accessToken = generateAccessToken(decoded.id, decoded.role)
    return accessToken
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token")
  }
};

export const forgotPassword = async (email: string) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail })
  if (!user) return

  const rawToken = crypto.randomBytes(32).toString("hex")
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  await PasswordReset.create({
    user: user._id,
    tokenHash: hashedToken,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  const resetUrl = `${env.CLIENT_URL}/reset-password/${rawToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your DesignFlow password",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
  });
};
