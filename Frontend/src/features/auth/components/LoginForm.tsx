import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
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
  client: "/client/dashboard",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  const inputClass =
    "w-full bg-white border border-border rounded-md text-charcoal text-sm " +
    "px-3 py-2.5 focus:outline-none focus:border-amber transition-colors " +
    "placeholder:text-muted/70";
  const errorClass = "text-xs text-ember mt-1";

  return (
    <AuthLayout>
      <p className="font-serif font-bold text-2xl text-charcoal mb-1">{heading}</p>
      <p className="text-sm text-muted mb-8">{subheading}</p>

      <form onSubmit={handleSubmit} className="space-y-5">
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
            className={inputClass}
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs text-muted uppercase tracking-wide font-semibold">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs text-amber underline underline-offset-2">
              Forgot?
            </Link>
          </div>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
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
          disabled={isPending || isGooglePending}
          className="w-full bg-clay hover:bg-ember transition-colors text-cream
                     text-xs uppercase tracking-wider font-semibold py-3 rounded-md
                     disabled:opacity-60"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {showGoogleSignIn && isGoogleSignInConfigured() && (
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
              disabled={isPending}
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

      {role === "client" && (
        <>
          <p className="text-sm text-muted mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-amber underline underline-offset-2 font-medium">
              Create one
            </Link>
          </p>
          <p className="text-sm text-muted mt-3">
            Are you a designer?{" "}
            <Link to="/designer/login" className="text-amber underline underline-offset-2 font-medium">
              Sign in here
            </Link>
          </p>
        </>
      )}

      {role === "designer" && (
        <p className="text-sm text-muted mt-8">
          Are you a client?{" "}
          <Link to="/client/login" className="text-amber underline underline-offset-2 font-medium">
            Sign in here
          </Link>
        </p>
      )}
    </AuthLayout>
  );
};

export default LoginForm;