import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Mail, Lock, Phone, MapPin } from "lucide-react";
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
import AuthInput from "../components/AuthInput";

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

  // handleChange removed - using controlled inputs directly

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
      console.error("Register validation errors:", result.error.issues);
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

  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  if (step === "otp") {
    return (
      <AuthLayout>
        <div className="mb-6 text-center">
          <h2 className="font-serif text-3xl mb-2 text-cream">Verify your email</h2>
          <p className="text-sm text-cream/70">{`We sent a 6-digit code to ${verificationEmail}.`}</p>
        </div>

        <form onSubmit={handleVerifyOtp} autoComplete="off" className="space-y-5">
          <AuthInput
            id="otp"
            label="Verification code"
            type="text"
            value={otp}
            onChange={(v) => {
              setOtp(v.replace(/\D/g, "").slice(0, 6));
              setOtpError("");
            }}
            placeholder="000000"
            icon={<Mail size={18} />}
            error={otpError}
          />

          <button
            type="submit"
            disabled={isVerifyingOtp || otp.length !== 6}
            className="w-full rounded-full bg-gradient-to-r from-[var(--color-brown)] to-amber py-3 text-sm uppercase tracking-wide text-cream hover:brightness-110 transition disabled:opacity-60"
          >
            {isVerifyingOtp ? "Verifying..." : "Verify email"}
          </button>
        </form>

        <div className="mt-6 space-y-3 text-center">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResendingOtp || isVerifyingOtp || resendSeconds > 0}
            className="text-sm text-amber hover:underline disabled:text-cream/50 disabled:no-underline"
          >
            {isResendingOtp
              ? "Sending new code..."
              : resendSeconds > 0
                ? `Resend code in ${resendSeconds}s`
                : "Resend code"}
          </button>

          <p className="text-sm text-cream/80">
            Wrong email?{" "}
            <button
              type="button"
              onClick={handleBackToDetails}
              disabled={isVerifyingOtp}
              className="text-amber hover:underline disabled:text-cream/50"
            >
              Change details
            </button>
          </p>

          <p className="text-xs text-cream/60">The code expires in 10 minutes.</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <p className="font-serif text-2xl text-cream mb-1">Create an account</p>
      <p className="text-sm text-cream/70 mb-5">Join DesignFlow to get started.</p>

      <form onSubmit={handleRequestOtp} autoComplete="off" className="space-y-3">
        <AuthInput
          id="fullName"
          label="Name"
          type="text"
          value={form.fullName}
          onChange={(v) => {
            setForm({ ...form, fullName: v });
            setErrors((prev) => ({ ...prev, fullName: undefined }));
          }}
          placeholder="Jane Doe"
          icon={<User size={18} />}
          error={errors.fullName}
          autoComplete="name"
        />

        <AuthInput
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => {
            setForm({ ...form, email: v });
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          placeholder="you@example.com"
          icon={<Mail size={18} />}
          error={errors.email}
          autoComplete="email"
        />

        <AuthInput
          id="phone"
          label="Phone number"
          type="tel"
          value={form.phone}
          onChange={(v) => {
            setForm({ ...form, phone: v });
            setErrors((prev) => ({ ...prev, phone: undefined }));
          }}
          placeholder="Your phone number"
          icon={<Phone size={18} />}
          error={errors.phone}
          autoComplete="tel"
        />

        <AuthInput
          id="address"
          label="Address"
          type="text"
          value={form.address}
          onChange={(v) => {
            setForm({ ...form, address: v });
            setErrors((prev) => ({ ...prev, address: undefined }));
          }}
          placeholder="Your address"
          icon={<MapPin size={18} />}
          error={errors.address}
          autoComplete="street-address"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AuthInput
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={(v) => {
              setForm({ ...form, password: v });
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder="Enter password"
            icon={<Lock size={18} />}
            error={errors.password}
            autoComplete="new-password"
          />

          <AuthInput
            id="confirmPassword"
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Confirm"
            icon={<Lock size={18} />}
          />
        </div>

        <label className="flex items-start gap-2 text-sm text-cream/80">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-1 rounded border-cream/40 bg-transparent"
          />
          I agree to Terms and conditions
        </label>

        {submitError && (
          <p role="alert" className="text-xs text-red-300">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isRequestingOtp || isGooglePending || !agreeTerms}
          className="w-full rounded-full bg-gradient-to-r from-[var(--color-brown)] to-amber py-2.5 text-sm uppercase tracking-wide text-cream hover:brightness-110 transition disabled:opacity-60"
        >
          {isRequestingOtp ? "Sending code..." : "Sign Up"}
        </button>
      </form>

      {isGoogleSignInConfigured() && (
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-cream/20" />
            <span className="text-xs uppercase tracking-wide text-cream/70">or</span>
            <div className="h-px flex-1 bg-cream/20" />
          </div>

          <div className="mt-4">
            <GoogleSignInButton
              onCredential={handleGoogleCredential}
              disabled={isRequestingOtp}
              pending={isGooglePending}
            />
          </div>

          {googleError && (
            <p role="alert" className="mt-2 text-center text-xs text-red-300">
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

      <p className="text-sm text-cream/80 mt-4 text-center">
        Already have an account?{" "}
        <Link to="/client/login" className="text-amber hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
