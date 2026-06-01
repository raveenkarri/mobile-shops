import { NavLink } from "react-router-dom";
import { Home, Image, MessageCircle, Package, Store } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/shop-setup", icon: Store, label: "Shop" },
  { to: "/products", icon: Package, label: "Products" },
  { to: "/banners", icon: Image, label: "Banners" },
  { to: "/chats", icon: MessageCircle, label: "Chats" },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-72 border-r border-slate-200 bg-slate-950/95 p-5 text-slate-200 lg:block">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-cyan-500/20 to-slate-900 p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Mobile Shop Platform</p>
        <h2 className="mt-2 text-xl font-semibold">Owner Workspace</h2>
      </div>

      <nav className="mt-6 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-100"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}