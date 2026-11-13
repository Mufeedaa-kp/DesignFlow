import { OAuth2Client } from "google-auth-library";
import { User, type IUser } from "../users/user.model";
import { ApiError } from "../../utils/ApiError";
import { env } from "../../config/env";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateToken";
import { normalizeEmail } from "../../utils/normalizeEmail";
import { isDuplicateKeyError } from "../../utils/mongoErrors";
import { ROLES } from "../../constants/roles";
import { PendingRegistration } from "./pendingRegistration.model";

const GOOGLE_ISSUERS = new Set([
  "accounts.google.com",
  "https://accounts.google.com",
]);

interface GoogleProfile {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

let googleClient: OAuth2Client | null = null;

const getGoogleClient = (): OAuth2Client => {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new ApiError(
      503,
      "Google Sign-In is not configured.",
      "GOOGLE_AUTH_NOT_CONFIGURED"
    );
  }

  if (!googleClient) {
    googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  }

  return googleClient;
};

const verifyGoogleCredential = async (
  credential: string
): Promise<GoogleProfile> => {
  const client = getGoogleClient();

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (
      !payload ||
      !payload.sub ||
      !payload.email ||
      payload.email_verified !== true
    ) {
      throw new ApiError(
        403,
        "Google has not verified this email address.",
        "GOOGLE_EMAIL_NOT_VERIFIED"
      );
    }

    if (!GOOGLE_ISSUERS.has(payload.iss)) {
      throw new ApiError(401, "Invalid Google token.", "GOOGLE_TOKEN_INVALID");
    }

    if (payload.aud !== env.GOOGLE_CLIENT_ID) {
      throw new ApiError(401, "Invalid Google token.", "GOOGLE_TOKEN_INVALID");
    }

    if (payload.exp * 1000 <= Date.now()) {
      throw new ApiError(
        401,
        "Google token has expired.",
        "GOOGLE_TOKEN_INVALID"
      );
    }

    return {
      sub: payload.sub,
      email: normalizeEmail(payload.email),
      name: payload.name?.trim(),
      picture: payload.picture,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      401,
      "Google Sign-In could not be verified. Please try again.",
      "GOOGLE_TOKEN_INVALID"
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

const getExistingEmailConflict = (user: IUser, googleId: string) => {
  if (user.googleId === googleId) {
    return issueTokens(user);
  }

  if (user.googleId) {
    throw new ApiError(
      409,
      "This Google account is already linked to a different DesignFlow account.",
      "GOOGLE_ACCOUNT_CONFLICT"
    );
  }

  throw new ApiError(
    409,
    "An account with this email already exists. Sign in with your password. Google account linking is not available yet.",
    "GOOGLE_ACCOUNT_LINK_REQUIRED"
  );
};

export const authenticateWithGoogle = async (credential: string) => {
  const profile = await verifyGoogleCredential(credential);

  const googleUser = await User.findOne({ googleId: profile.sub });
  if (googleUser) {
    return issueTokens(googleUser);
  }

  const emailUser = await User.findOne({ email: profile.email });
  if (emailUser) {
    return getExistingEmailConflict(emailUser, profile.sub);
  }

  const fullName =
    profile.name || profile.email.split("@")[0] || "DesignFlow user";

  try {
    const user = await User.create({
      fullName,
      email: profile.email,
      googleId: profile.sub,
      emailVerifiedAt: new Date(),
      role: ROLES.CLIENT,
      status: "active",
      profileImage: profile.picture || "",
    });

    await PendingRegistration.deleteOne({ email: profile.email }).catch(
      () => undefined
    );

    return issueTokens(user);
  } catch (error) {
    if (!isDuplicateKeyError(error)) {
      throw new ApiError(
        503,
        "Unable to complete Google Sign-In. Please try again.",
        "GOOGLE_AUTH_FAILED"
      );
    }

    const racedGoogleUser = await User.findOne({ googleId: profile.sub });
    if (racedGoogleUser) {
      return issueTokens(racedGoogleUser);
    }

    const racedEmailUser = await User.findOne({ email: profile.email });
    if (racedEmailUser) {
      return getExistingEmailConflict(racedEmailUser, profile.sub);
    }

    throw new ApiError(
      503,
      "Unable to complete Google Sign-In. Please try again.",
      "GOOGLE_AUTH_FAILED"
    );
  }
};
