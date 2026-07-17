import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      login(data.user, data.token);
      toast.success("Login successful");

      if (data.user.role === "admin") navigate("/admin/dashboard");
      else if (data.user.role === "designer") navigate("/designer/dashboard");
      else navigate("/client/dashboard");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Registration failed");
      } else {
        toast.error("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
         <p style={{ textAlign: "right", margin: "8px 0" }}>
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;