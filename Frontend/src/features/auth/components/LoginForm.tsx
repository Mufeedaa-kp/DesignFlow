import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useLoginMutation } from "../hooks/useAuthMutations";
import {
  useGoogleAuth,
  type GoogleAuthFailure,
} from "../hooks/useGoogleAuth";
import { loginSchema, type LoginFormValues } from "../schema/auth.schema";
import AuthLayout from "../layouts/AuthLayout";
import GoogleSignInButton from "./GoogleSignInButton";
import { isGoogleSignInConfigured } from "../utils/googleClientId";
import { getErrorMessage } from "../../../shared/utils/errors";
import AuthInput from "./AuthInput";

type Role = "admin" | "designer" | "client";

interface LoginFormProps {
  role: Role;
  heading: string;
  subheading: string;
  showGoogleSignIn?: boolean;
}

const roleRedirects: Record<Role, string> = {
  admin: "/admin/dashboard",
  designer: "/designer/dashboard",
  client: "/",
};

const LoginForm = ({
  role,
  heading,
  subheading,
  showGoogleSignIn = false,
}: LoginFormProps) => {
  const [form, setForm] = useState<LoginFormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [googleError, setGoogleError] = useState<GoogleAuthFailure | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { mutateAsync: doLogin, isPending } = useLoginMutation();
  const { signInWithGoogle, isPending: isGooglePending } = useGoogleAuth();

  const handleGoogleCredential = async (credential: string) => {
    setGoogleError(null);
    setSubmitError("");

    const failure = await signInWithGoogle(credential, role);

    if (failure) {
      setGoogleError(failure);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError("");
    setGoogleError(null);

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      console.error("Login validation errors:", result.error.issues);
      const fieldErrors: Partial<Record<keyof LoginFormValues, string>> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as keyof LoginFormValues] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const data = await doLogin({ ...result.data, expectedRole: role });
      login(data.user, data.accessToken);
      toast.success("Login successful");
      navigate(roleRedirects[data.user.role as Role], {replace:true});
    } catch (err: unknown) {
      setSubmitError(getErrorMessage(err));
    }
  };

  return (
    <AuthLayout>
      <p className="font-serif text-2xl text-cream mb-1">{heading}</p>
      <p className="text-sm text-cream/70 mb-5">{subheading}</p>

      <form onSubmit={handleSubmit} className="space-y-3">
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
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={(v) => {
            setForm({ ...form, password: v });
            setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          placeholder="Enter your password"
          icon={<Lock size={18} />}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-cream/80">
            <input type="checkbox" className="rounded border-cream/40 bg-transparent" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-amber hover:underline">
            Forgot password?
          </Link>
        </div>

        {submitError && (
          <p role="alert" className="text-xs text-red-300">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || isGooglePending}
          className="w-full rounded-full bg-gradient-to-r from-[var(--color-brown)] to-amber py-2.5 text-sm uppercase tracking-wide text-cream hover:brightness-110 transition disabled:opacity-60"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {showGoogleSignIn && isGoogleSignInConfigured() && (
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-cream/20" />
            <span className="text-xs uppercase tracking-wide text-cream/70">or</span>
            <div className="h-px flex-1 bg-cream/20" />
          </div>

          <div className="mt-4">
            <GoogleSignInButton
              onCredential={handleGoogleCredential}
              disabled={isPending}
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

      {role === "client" && (
        <>
          <p className="text-sm text-cream/80 mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-amber hover:underline">
              Sign up
            </Link>
          </p>
          <p className="text-xs text-cream/70 mt-1 text-center">
            Are you a designer?{" "}
            <Link to="/designer/login" className="text-amber hover:underline">
              Sign in here
            </Link>
          </p>
        </>
      )}

      {role === "designer" && (
        <p className="text-sm text-cream/80 mt-4 text-center">
          Are you a client?{" "}
          <Link to="/client/login" className="text-amber hover:underline">
            Sign in here
          </Link>
        </p>
      )}
    </AuthLayout>
  );
};

export default LoginForm;