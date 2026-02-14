import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      const serverData = err.response?.data;
      const details = Array.isArray(serverData?.details) ? serverData.details.join(", ") : "";
      setError(details || serverData?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <form
        onSubmit={handleSubmit}
        className="bg-white/20 backdrop-blur-lg p-8 rounded-xl w-96 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          CampusConnect
        </h2>

        {error && (
          <p className="text-red-300 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          className="w-full mb-4 p-3 rounded bg-white/80 outline-none"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full mb-6 p-3 rounded bg-white/80 outline-none"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="mt-5 text-center text-sm text-white/90">
          New to CampusConnect?{" "}
          <Link to="/register" className="font-semibold text-amber-200 hover:text-amber-100">
            Sign up
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-white/80">
          <span className="block">© 2006 rights reserved</span>
          <span className="block">built by APARNA KONDIPARTHY ❤️</span>
        </p>
      </form>
    </div>
  );
}


export default Login;


