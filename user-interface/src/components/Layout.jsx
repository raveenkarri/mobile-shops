import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { LogOut, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import CartDrawer from "./CartDrawer";

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe_0,_#f8fafc_38%,_#f8fafc_100%)]">
        <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-slate-900">
              Mobile<span className="text-cyan-600">Mart</span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCartOpen(true)}
                className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
              >
                <ShoppingBag size={18} />
                {itemCount > 0 ? (
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-cyan-600 text-xs font-semibold text-white">
                    {itemCount}
                  </span>
                ) : null}
              </button>

              {user ? (
                <>
                  <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 sm:flex">
                    <User size={16} className="text-cyan-700" />
                    {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
