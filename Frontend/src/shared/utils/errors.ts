import { isAxiosError } from "axios";
import toast from "react-hot-toast";

const DEFAULT_ERROR_MESSAGE =
  "Unable to complete your request. Please try again.";

const NETWORK_ERROR_MESSAGE =
  "Unable to connect. Please check your connection and try again.";

const SERVER_ERROR_MESSAGE =
  "Something went wrong on our end. Please try again.";

const VALIDATION_ERROR_MESSAGE =
  "Please check the highlighted fields and try again.";

const FRIENDLY_CODE_MESSAGES: Record<string, string> = {
  EMAIL_ALREADY_EXISTS: "An account with this email already exists.",
  OTP_EMAIL_FAILED: "We couldn't send the verification code. Please try again.",
  OTP_EXPIRED: "Your verification code has expired. Request a new code.",
  OTP_INVALID: "That verification code is incorrect.",
  OTP_ATTEMPTS_EXCEEDED: "Too many incorrect attempts. Request a new code.",
  OTP_EMAIL_LIMIT_REACHED: "Too many verification codes requested. Try again later.",
  OTP_RESEND_COOLDOWN: "Please wait before requesting another verification code.",
  GOOGLE_AUTH_NOT_CONFIGURED: "Google Sign-In is not available right now.",
  GOOGLE_EMAIL_NOT_VERIFIED:
    "Google has not verified this email address. Please use another sign-in method.",
  GOOGLE_ACCOUNT_LINK_REQUIRED:
    "An account with this email already exists. Sign in with your password instead.",
  GOOGLE_ACCOUNT_CONFLICT:
    "This Google account is already linked to a different DesignFlow account.",
  GOOGLE_TOKEN_INVALID:
    "Google Sign-In could not be verified. Please try again.",
  GOOGLE_AUTH_FAILED:
    "Unable to complete Google Sign-In. Please try again.",
  ACCOUNT_INACTIVE: "This account is inactive or blocked.",
  CATALOG_ITEM_EXISTS: "This product already exists.",
  CATEGORY_EXISTS: "This category already exists.",
  MATERIAL_EXISTS: "This material already exists.",
  COLOR_THEME_EXISTS: "This color theme already exists.",
  MOODBOARD_EXISTS: "A mood board already exists for this project.",
  QUOTATION_EXISTS: "A quotation already exists for this project.",
};

const TECHNICAL_MESSAGE_PATTERN =
  /(mongodb|mongoose|objectid|stack trace|syntaxerror|typeerror|referenceerror|econn|errno|failed to cast|internal server error|validation failed)/i;

interface ApiErrorBody {
  message?: unknown;
  code?: unknown;
  errors?: unknown;
  retryAfterSeconds?: unknown;
  attemptsRemaining?: unknown;
}

export interface ApiErrorDetails {
  status?: number;
  code?: string;
  message: string;
  fieldErrors: Record<string, string>;
  retryAfterSeconds?: number;
  attemptsRemaining?: number;
  isValidation: boolean;
  isBusinessConflict: boolean;
  isAuthError: boolean;
  isNetworkError: boolean;
}

const getOptionalNumber = (value: unknown): number | undefined => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }

  return Math.max(0, Math.ceil(value));
};

const getFieldErrors = (errors: unknown): Record<string, string> => {
  if (!Array.isArray(errors)) {
    return {};
  }

  return errors.reduce<Record<string, string>>((result, issue) => {
    if (!issue || typeof issue !== "object") {
      return result;
    }

    const path = (issue as { path?: unknown }).path;
    const message = (issue as { message?: unknown }).message;

    if (
      !Array.isArray(path) ||
      path.length === 0 ||
      typeof message !== "string" ||
      result[String(path[0])]
    ) {
      return result;
    }

    result[String(path[0])] = message;
    return result;
  }, {});
};

const getFallbackForStatus = (status?: number) => {
  if (!status) return NETWORK_ERROR_MESSAGE;
  if (status === 401) {
    return "Your session has expired. Please sign in again.";
  }
  if (status === 403) {
    return "You don't have permission to do that.";
  }
  if (status === 404) {
    return "The requested item could not be found.";
  }
  if (status === 409) {
    return "This action conflicts with an existing item.";
  }
  if (status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }
  if (status >= 500) {
    return SERVER_ERROR_MESSAGE;
  }
  return DEFAULT_ERROR_MESSAGE;
};

export const getApiError = (error: unknown): ApiErrorDetails => {
  if (!isAxiosError(error)) {
    return {
      message: DEFAULT_ERROR_MESSAGE,
      fieldErrors: {},
      isValidation: false,
      isBusinessConflict: false,
      isAuthError: false,
      isNetworkError: false,
    };
  }

  const status = error.response?.status;
  const body = (error.response?.data ?? {}) as ApiErrorBody;
  const code = typeof body.code === "string" ? body.code : undefined;
  const fieldErrors = getFieldErrors(body.errors);
  const retryAfterSeconds = getOptionalNumber(body.retryAfterSeconds);
  const attemptsRemaining = getOptionalNumber(body.attemptsRemaining);
  const hasFieldErrors = Object.keys(fieldErrors).length > 0;
  const isValidation =
    code === "VALIDATION_ERROR" ||
    (status === 400 && hasFieldErrors);
  const isNetworkError = !error.response;

  const rawMessage =
    typeof body.message === "string" ? body.message.trim() : "";

  const isSafeMessage =
    rawMessage.length > 0 &&
    !TECHNICAL_MESSAGE_PATTERN.test(rawMessage);

  const friendlyCodeMessage = code
    ? FRIENDLY_CODE_MESSAGES[code]
    : undefined;

  let message = friendlyCodeMessage ?? (isSafeMessage ? rawMessage : "");

  if (isNetworkError) {
    message = NETWORK_ERROR_MESSAGE;
  } else if (isValidation) {
    message = VALIDATION_ERROR_MESSAGE;
  } else if (
    typeof status === "number" &&
    status >= 500 &&
    !friendlyCodeMessage
  ) {
    message = SERVER_ERROR_MESSAGE;
  } else if (!message) {
    message = getFallbackForStatus(status);
  }

  return {
    status,
    code,
    message,
    fieldErrors,
    retryAfterSeconds,
    attemptsRemaining,
    isValidation,
    isBusinessConflict: status === 409,
    isAuthError: status === 401 || status === 403,
    isNetworkError,
  };
};

export const getErrorMessage = (error: unknown): string => {
  return getApiError(error).message;
};

export const notifyClientError = (
  error: unknown,
  fallback = DEFAULT_ERROR_MESSAGE
): boolean => {
  const details = getApiError(error);

  if (details.isValidation) {
    return false;
  }

  const message =
    details.message === DEFAULT_ERROR_MESSAGE ? fallback : details.message;
  const id = `api-error:${details.code ?? details.status ?? message}`;

  toast.error(message, { id });
  return true;
};

export const notifyAdminError = (
  error: unknown,
  fallback = DEFAULT_ERROR_MESSAGE
): void => {
  const details = getApiError(error);
  const message =
    details.message === DEFAULT_ERROR_MESSAGE ? fallback : details.message;
  const id = `api-error:${details.code ?? details.status ?? message}`;

  toast.error(message, { id });
};
