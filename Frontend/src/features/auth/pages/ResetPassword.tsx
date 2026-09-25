

import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import api from "../../../services/api";
import AuthLayout from "../layouts/AuthLayout";
import { resetPasswordSchema } from "../schema/resetPassword.schema";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful — please sign in");
      navigate("/login");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Reset link invalid or expired");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white border border-border rounded-md text-charcoal text-sm " +
    "px-3 py-2.5 focus:outline-none focus:border-amber transition-colors " +
    "placeholder:text-muted/70";

  return (
    <AuthLayout>
      <p className="font-serif font-bold text-2xl text-charcoal mb-1">Set a new password</p>
      <p className="text-sm text-muted mb-8">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs text-muted uppercase tracking-wide font-semibold mb-2">
            New password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs text-muted uppercase tracking-wide font-semibold mb-2">
            Confirm password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-clay hover:bg-ember transition-colors text-cream
                     text-xs uppercase tracking-wider font-semibold py-3 rounded-md
                     disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset password"}
        </button>
      </form>

      <p className="text-sm text-muted mt-8">
        <Link to="/login" className="text-amber underline underline-offset-2 font-medium">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPassword;