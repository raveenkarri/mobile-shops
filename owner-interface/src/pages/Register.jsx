import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "OWNER",
  });
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

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
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(160deg,#082f49_0%,#0e7490_55%,#e0f2fe_100%)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-slate-200/40 bg-white/95 p-7 shadow-2xl"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">Owner Portal</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Create owner account</h1>

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
            className="w-full rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:opacity-60"
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