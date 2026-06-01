import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export default function Register() {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "USER",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(145deg,#1e293b_0%,#0e7490_60%,#cffafe_100%)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-slate-200/30 bg-white/95 p-7 shadow-2xl"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">Customer Portal</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Create account</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            required
            placeholder="Full name"
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={formData.email}
            onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none"
          />
          <input
            type="tel"
            required
            placeholder="Phone number"
            value={formData.phone}
            onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account? {" "}
          <Link to="/login" className="font-semibold text-cyan-700 hover:text-cyan-600">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}