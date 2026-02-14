import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      login(res.data);
      setSuccess("Account created successfully. Redirecting...");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      const networkMessage = err.code === "ERR_NETWORK" ? "Server is not reachable. Start backend on port 5000." : null;
      setError(serverMessage || networkMessage || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(circle at 14% 10%, rgba(20, 184, 166, 0.28), transparent 42%), radial-gradient(circle at 90% 12%, rgba(245, 158, 11, 0.25), transparent 46%), linear-gradient(140deg, #f8fafc 0%, #eef4f8 38%, #fdf7eb 100%)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/85 p-7 shadow-2xl backdrop-blur"
      >
        <p className="cc-chip mb-4">Create Account</p>
        <h2 className="text-3xl font-extrabold text-slate-900">Join CampusConnect</h2>
        <p className="mt-2 text-sm text-slate-600">
          Build your campus profile and discover opportunities.
        </p>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {success && <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>}

        <div className="mt-5 space-y-3">
          <input
            name="name"
            className="cc-input w-full"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            className="cc-input w-full"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            className="cc-input w-full"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="cc-button cc-button-primary mt-5 w-full py-3 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/" className="font-semibold text-teal-700 hover:text-teal-600">
            Login
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-slate-500">
          <span className="block">© 2006 rights reserved</span>
          <span className="block">built by APARNA KONDIPARTHY ❤️</span>
        </p>
      </form>
    </div>
  );
}

export default Register;
