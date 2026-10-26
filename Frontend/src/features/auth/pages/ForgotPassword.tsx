
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import api from "../../../services/api";
import AuthLayout from "../layouts/AuthLayout";
import { getErrorMessage } from "../../../shared/utils/errors";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Valid email is required");

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setSubmitError("");

    const result = emailSchema.safeParse(email);

    if (!result.success) {
      setEmailError(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: result.data });
      setSent(true);
    } catch (err: unknown) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <p className="font-serif font-bold text-2xl text-charcoal mb-1">Reset password</p>
      <p className="text-sm text-muted mb-8">
        Enter your email and we'll send you a reset link.
      </p>

      {sent ? (
        <p className="text-sm text-charcoal bg-panel/50 border border-border rounded-md p-4">
          If that email exists, a reset link has been sent.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs text-muted uppercase tracking-wide font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
                setSubmitError("");
              }}
              required
              aria-invalid={Boolean(emailError)}
              className="w-full bg-white border border-border rounded-md text-charcoal text-sm
                         px-3 py-2.5 focus:outline-none focus:border-amber transition-colors
                         placeholder:text-muted/70"
            />
            {emailError && (
              <p role="alert" className="text-xs text-ember mt-1">
                {emailError}
              </p>
            )}
          </div>

          {submitError && (
            <p role="alert" className="text-xs text-ember">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-clay hover:bg-ember transition-colors text-cream
                       text-xs uppercase tracking-wider font-semibold py-3 rounded-md
                       disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}

      <p className="text-sm text-muted mt-8">
        <Link to="/login" className="text-amber underline underline-offset-2 font-medium">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;