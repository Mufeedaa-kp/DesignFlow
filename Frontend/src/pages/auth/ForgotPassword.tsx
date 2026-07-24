
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import api from "../../services/api";
import AuthLayout from "../../components/layout/AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("Reset link sent (check console for now)");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
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
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white border border-border rounded-md text-charcoal text-sm
                         px-3 py-2.5 focus:outline-none focus:border-amber transition-colors
                         placeholder:text-muted/70"
            />
          </div>

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