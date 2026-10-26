import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import {
  useRequestRegistrationOtpMutation,
  useResendRegistrationOtpMutation,
  useVerifyRegistrationOtpMutation,
} from "../hooks/useAuthMutations";
import {
  useGoogleAuth,
  type GoogleAuthFailure,
} from "../hooks/useGoogleAuth";
import {
  otpVerificationSchema,
  registerSchema,
  type RegisterFormValues,
} from "../schema/auth.schema";
import AuthLayout from "../layouts/AuthLayout";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { isGoogleSignInConfigured } from "../utils/googleClientId";
import { getApiError } from "../../../shared/utils/errors";

type RegistrationStep = "details" | "otp";

const Register = () => {
  const [form, setForm] = useState<RegisterFormValues>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormValues, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [step, setStep] = useState<RegistrationStep>("details");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const [googleError, setGoogleError] = useState<GoogleAuthFailure | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { mutateAsync: requestOtp, isPending: isRequestingOtp } =
    useRequestRegistrationOtpMutation();
  const { mutateAsync: resendOtp, isPending: isResendingOtp } =
    useResendRegistrationOtpMutation();
  const { mutateAsync: verifyOtp, isPending: isVerifyingOtp } =
    useVerifyRegistrationOtpMutation();
  const { signInWithGoogle, isPending: isGooglePending } = useGoogleAuth();

  useEffect(() => {
    if (step !== "otp" || resendSeconds <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setResendSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [step, resendSeconds]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
    setOtpError("");
  };

  const handleGoogleCredential = async (credential: string) => {
    setGoogleError(null);
    setSubmitError("");

    const failure = await signInWithGoogle(credential);

    if (failure) {
      setGoogleError(failure);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError("");
    setGoogleError(null);

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormValues, string>> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as keyof RegisterFormValues] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const data = await requestOtp(result.data);

      setVerificationEmail(data.email);
      setOtp("");
      setOtpError("");
      setResendSeconds(data.resendAfterSeconds);
      setStep("otp");
      toast.success("Verification code sent");
    } catch (err: unknown) {
      const details = getApiError(err);

      if (details.code === "EMAIL_ALREADY_EXISTS") {
        setErrors({ email: details.message });
        return;
      }

      const backendFieldErrors =
        details.fieldErrors as Partial<Record<keyof RegisterFormValues, string>>;

      if (Object.keys(backendFieldErrors).length > 0) {
        setErrors(backendFieldErrors);
        return;
      }

      setSubmitError(details.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");

    const result = otpVerificationSchema.safeParse({
      email: verificationEmail,
      otp,
    });

    if (!result.success) {
      setOtpError(
        result.error.issues[0]?.message ??
          "Enter the 6-digit verification code."
      );
      return;
    }

    try {
      const data = await verifyOtp(result.data);
      login(data.user, data.accessToken);
      toast.success("Email verified. Account created.");
      navigate(`/${data.user.role}/dashboard`, { replace: true });
    } catch (err: unknown) {
      const details = getApiError(err);

      if (details.code === "OTP_INVALID") {
        const attemptsMessage =
          details.attemptsRemaining !== undefined
            ? ` ${details.attemptsRemaining} attempt${
                details.attemptsRemaining === 1 ? "" : "s"
              } remaining.`
            : "";

        setOtpError(`${details.message}${attemptsMessage}`);
        return;
      }

      setOtpError(details.message);
    }
  };

  const handleResendOtp = async () => {
    if (!verificationEmail || isResendingOtp || resendSeconds > 0) {
      return;
    }

    setOtpError("");

    try {
      const data = await resendOtp(verificationEmail);
      setOtp("");
      setResendSeconds(data.resendAfterSeconds);
      toast.success("A new verification code was sent");
    } catch (err: unknown) {
      const details = getApiError(err);

      if (details.code === "OTP_RESEND_COOLDOWN") {
        const seconds = details.retryAfterSeconds ?? 60;
        setResendSeconds(seconds);
        setOtpError(
          `Please wait ${seconds} second${
            seconds === 1 ? "" : "s"
          } before requesting another code.`
        );
        return;
      }

      if (details.code === "OTP_EMAIL_LIMIT_REACHED") {
        if (details.retryAfterSeconds !== undefined) {
          setResendSeconds(details.retryAfterSeconds);
        }
        setOtpError(details.message);
        return;
      }

      if (details.code === "OTP_EMAIL_FAILED") {
        setResendSeconds(60);
        setOtpError(details.message);
        return;
      }

      setOtpError(details.message);
    }
  };

  const handleBackToDetails = () => {
    setStep("details");
    setVerificationEmail("");
    setOtp("");
    setOtpError("");
    setSubmitError("");
    setGoogleError(null);
    setResendSeconds(0);
  };

  const inputClass =
    "w-full bg-white border border-border rounded-md text-charcoal text-sm " +
    "px-3 py-2.5 focus:outline-none focus:border-amber transition-colors " +
    "placeholder:text-muted/70";
  const errorClass = "text-xs text-ember mt-1";

  if (step === "otp") {
    return (
      <AuthLayout>
        <p className="font-serif font-bold text-2xl text-charcoal mb-1">Verify your email</p>
        <p className="text-sm text-muted mb-8">
          We sent a 6-digit code to{" "}
          <span className="text-charcoal font-medium">{verificationEmail}</span>.
        </p>

        <form onSubmit={handleVerifyOtp} autoComplete="off" className="space-y-5">
          <div>
            <label className="block text-xs text-muted uppercase tracking-wide font-semibold mb-2">
              Verification code
            </label>
            <input
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              disabled={isVerifyingOtp}
              autoFocus
              className={`${inputClass} text-center tracking-[0.5em] text-base`}
            />
            {otpError && (
              <p role="alert" className={errorClass}>
                {otpError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifyingOtp || otp.length !== 6}
            className="w-full bg-clay hover:bg-ember transition-colors text-cream
                       text-xs uppercase tracking-wider font-semibold py-3 rounded-md
                       disabled:opacity-60"
          >
            {isVerifyingOtp ? "Verifying..." : "Verify email"}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResendingOtp || isVerifyingOtp || resendSeconds > 0}
            className="text-sm text-amber underline underline-offset-2 font-medium
                       disabled:text-muted disabled:no-underline disabled:cursor-not-allowed"
          >
            {isResendingOtp
              ? "Sending new code..."
              : resendSeconds > 0
                ? `Resend code in ${resendSeconds}s`
                : "Resend code"}
          </button>

          <p className="text-sm text-muted">
            Wrong email?{" "}
            <button
              type="button"
              onClick={handleBackToDetails}
              disabled={isVerifyingOtp}
              className="text-amber underline underline-offset-2 font-medium
                         disabled:text-muted disabled:no-underline disabled:cursor-not-allowed"
            >
              Change details
            </button>
          </p>

          <p className="text-xs text-muted">The code expires in 10 minutes.</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <p className="font-serif font-bold text-2xl text-charcoal mb-1">Create an account</p>
      <p className="text-sm text-muted mb-8">Join DesignFlow to get started.</p>

      <form onSubmit={handleRequestOtp} autoComplete="off" className="space-y-5">
        <div>
          <label className="block text-xs text-muted uppercase tracking-wide font-semibold mb-2">
            Full name
          </label>
          <input
            name="fullName"
            placeholder="Jane Doe"
            value={form.fullName}
            onChange={handleChange}
            disabled={isRequestingOtp}
            className={inputClass}
          />
          {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-xs text-muted uppercase tracking-wide font-semibold mb-2">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            disabled={isRequestingOtp}
            className={inputClass}
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs text-muted uppercase tracking-wide font-semibold mb-2">
            Phone number
          </label>

          <input
            name="phone"
            type="tel"
            placeholder=""
            value={form.phone}
            onChange={handleChange}
            disabled={isRequestingOtp}
            className={inputClass}
          />

          {errors.phone && <p className={errorClass}>{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-xs text-muted uppercase tracking-wide font-semibold mb-2">
            Address
          </label>

          <input
            name="address"
            type="text"
            placeholder="Your address"
            value={form.address}
            onChange={handleChange}
            disabled={isRequestingOtp}
            className={inputClass}
          />

          {errors.address && <p className={errorClass}>{errors.address}</p>}
        </div>

        <div>
          <label className="block text-xs text-muted uppercase tracking-wide font-semibold mb-2">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            disabled={isRequestingOtp}
            className={inputClass}
          />
          {errors.password && <p className={errorClass}>{errors.password}</p>}
        </div>

        {submitError && (
          <p role="alert" className="text-xs text-ember">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isRequestingOtp || isGooglePending}
          className="w-full bg-clay hover:bg-ember transition-colors text-cream
                     text-xs uppercase tracking-wider font-semibold py-3 rounded-md
                     disabled:opacity-60"
        >
          {isRequestingOtp ? "Sending code..." : "Create account"}
        </button>
      </form>

      {isGoogleSignInConfigured() && (
        <div className="mt-6">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[10px] uppercase tracking-[2px] text-muted font-semibold">
              or
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="mt-5">
            <GoogleSignInButton
              onCredential={handleGoogleCredential}
              disabled={isRequestingOtp}
              pending={isGooglePending}
            />
          </div>

          {googleError && (
            <p role="alert" className="mt-3 text-center text-xs text-ember">
              {googleError.message}{" "}
              {googleError.action && (
                <Link
                  to={googleError.action.to}
                  className="font-medium underline underline-offset-2"
                >
                  {googleError.action.label}
                </Link>
              )}
            </p>
          )}
        </div>
      )}

      <p className="text-sm text-muted mt-8">
        Already have an account?{" "}
        <Link to="/login" className="text-amber underline underline-offset-2 font-medium">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
