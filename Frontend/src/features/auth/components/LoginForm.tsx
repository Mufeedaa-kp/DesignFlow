import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useAuth } from "../hooks/useAuth";
import { useLoginMutation } from "../hooks/useAuthMutations";
import { loginSchema, type LoginFormValues } from "../schema/auth.schema";
import AuthLayout from "../layouts/AuthLayout";

type Role = "admin" | "designer" | "client";

interface LoginFormProps {
  role: Role;
  heading: string;
  subheading: string;
}

const roleRedirects: Record<Role, string> = {
  admin: "/admin/dashboard",
  designer: "/designer/dashboard",
  client: "/client/dashboard",
};

const LoginForm = ({ role, heading, subheading }: LoginFormProps) => {
  const [form, setForm] = useState<LoginFormValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const { mutateAsync: doLogin, isPending } = useLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

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
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Login failed");
      } else {
        toast.error("Login failed");
      }
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

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-clay hover:bg-ember transition-colors text-cream
                     text-xs uppercase tracking-wider font-semibold py-3 rounded-md
                     disabled:opacity-60"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>

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