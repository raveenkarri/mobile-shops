import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { LogOut, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import CartDrawer from "./CartDrawer";
import ThemeToggle from "./ui/ThemeToggle";

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
      <div className="app-shell">
        <nav className="sticky top-0 z-40 border-b border-app bg-surface backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary">
              Mobile<span className="text-accent">Mart</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <button
                onClick={() => setCartOpen(true)}
                className="relative rounded-xl border border-app bg-surface p-2.5 text-primary transition hover:border-accent"
              >
                <ShoppingBag size={18} />
                {itemCount > 0 ? (
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-accent text-xs font-semibold text-white">
                    {itemCount}
                  </span>
                ) : null}
              </button>

              {user ? (
                <>
                  <div className="hidden items-center gap-2 rounded-xl border border-app bg-surface px-3 py-2 text-sm text-primary sm:flex">
                    <User size={16} className="text-accent" />
                    {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-xl border border-app bg-surface p-2.5 text-primary transition hover:border-rose-400 hover:text-rose-500"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <Link to="/login" className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                  Login
                </Link>
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
