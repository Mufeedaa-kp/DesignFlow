import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useAuth } from "../hooks/useAuth";
import { useRegisterMutation } from "../hooks/useAuthMutations";
import { registerSchema, type RegisterFormValues } from "../schema/auth.schema";
import AuthLayout from "../layouts/AuthLayout";

const Register = () => {
  const [form, setForm] = useState<RegisterFormValues>({
  fullName: "",
  email: "",
  phone: "",
  address: "",
  password: "",
});
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormValues, string>>>({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const { mutateAsync: doRegister, isPending } = useRegisterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

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
      const data = await doRegister(result.data);
      login(data.user, data.accessToken);
      toast.success("Registered successfully");
      navigate(`/${data.user.role}/dashboard`, { replace: true });
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Registration failed");
      } else {
        toast.error("Registration failed");
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
      <p className="font-serif font-bold text-2xl text-charcoal mb-1">Create an account</p>
      <p className="text-sm text-muted mb-8">Join DesignFlow to get started.</p>

      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
        <div>
          <label className="block text-xs text-muted uppercase tracking-wide font-semibold mb-2">
            Full name
          </label>
          <input
            name="fullName"
            placeholder="Jane Doe"
            value={form.fullName}
            onChange={handleChange}
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
    className={inputClass}
  />

  {errors.phone && (
    <p className={errorClass}>
      {errors.phone}
    </p>
  )}
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
    className={inputClass}
  />

  {errors.address && (
    <p className={errorClass}>
      {errors.address}
    </p>
  )}
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
          {isPending ? "Creating account..." : "Create account"}
        </button>
      </form>

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