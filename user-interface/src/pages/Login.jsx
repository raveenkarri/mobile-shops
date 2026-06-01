import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(145deg,#0f172a_0%,#155e75_55%,#cffafe_100%)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-slate-200/30 bg-white/95 p-7 shadow-2xl"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">Customer Portal</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome back</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Need an account? {" "}
          <Link to="/register" className="font-semibold text-cyan-700 hover:text-cyan-600">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}