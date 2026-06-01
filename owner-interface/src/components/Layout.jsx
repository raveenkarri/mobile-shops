import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Sidebar from "./Sidebar";
import Button from "./ui/Button";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top,_#cffafe_0%,_#f8fafc_35%,_#f8fafc_100%)] text-slate-900">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Control Panel</p>
              <h1 className="text-xl font-bold">Welcome, {user?.name}</h1>
            </div>
            <Button variant="subtle" onClick={handleLogout} className="border border-slate-200 bg-white">
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </header>
        <motion.main
          className="flex-1 p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}