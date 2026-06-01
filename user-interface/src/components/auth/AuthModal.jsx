import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import Modal from "../ui/Modal";

export default function AuthModal({ mode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "USER",
  });

  const isLogin = useMemo(() => mode === "login", [mode]);
  const closeTo = location.state?.from?.pathname || "/";

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    const result = await login(loginData.email, loginData.password);
    setLoading(false);
    if (result.success) {
      navigate(closeTo, { replace: true });
    } else {
      toast.error(result.error);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    const result = await register(registerData);
    setLoading(false);
    if (result.success) {
      navigate("/", { replace: true });
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-cyan-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_50%)]" />
      <Modal open onClose={() => navigate("/")}>
        {isLogin ? (
          <>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Customer Access</p>
            <h1 className="mt-2 text-3xl font-bold text-primary">Welcome back</h1>
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <input type="email" required placeholder="Email" value={loginData.email} onChange={(event) => setLoginData((prev) => ({ ...prev, email: event.target.value }))} className="input" />
              <input type="password" required placeholder="Password" value={loginData.password} onChange={(event) => setLoginData((prev) => ({ ...prev, password: event.target.value }))} className="input" />
              <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Signing in..." : "Login"}</button>
            </form>
            <p className="mt-4 text-center text-sm text-muted">Need an account? <Link to="/register" className="font-semibold text-accent">Register</Link></p>
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Customer Access</p>
            <h1 className="mt-2 text-3xl font-bold text-primary">Create account</h1>
            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <input type="text" required placeholder="Full name" value={registerData.name} onChange={(event) => setRegisterData((prev) => ({ ...prev, name: event.target.value }))} className="input" />
              <input type="email" required placeholder="Email" value={registerData.email} onChange={(event) => setRegisterData((prev) => ({ ...prev, email: event.target.value }))} className="input" />
              <input type="password" required placeholder="Password" value={registerData.password} onChange={(event) => setRegisterData((prev) => ({ ...prev, password: event.target.value }))} className="input" />
              <input type="tel" required placeholder="Phone number" value={registerData.phone} onChange={(event) => setRegisterData((prev) => ({ ...prev, phone: event.target.value }))} className="input" />
              <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Creating..." : "Register"}</button>
            </form>
            <p className="mt-4 text-center text-sm text-muted">Already have an account? <Link to="/login" className="font-semibold text-accent">Login</Link></p>
          </>
        )}
      </Modal>
    </div>
  );
}