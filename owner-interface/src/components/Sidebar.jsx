import { NavLink } from "react-router-dom";
import { Home, Image, MessageCircle, Package, Store, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/shop-setup", icon: Store, label: "Shop" },
  { to: "/products", icon: Package, label: "Products" },
  { to: "/banners", icon: Image, label: "Banners" },
  { to: "/chats", icon: MessageCircle, label: "Chats" },
];

const SidebarContent = ({ onLinkClick }) => (
  <>
    <div className="rounded-2xl border border-app bg-gradient-to-br from-cyan-500/15 to-transparent p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">Mobile Shop Platform</p>
      <h2 className="mt-2 text-xl font-semibold text-primary">Owner Workspace</h2>
    </div>

    <nav className="mt-6 space-y-2">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onLinkClick}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              isActive ? "bg-accent text-white" : "text-muted hover:bg-app hover:text-primary"
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  </>
);

export default function Sidebar({ isMobileOpen, onClose }) {
  return (
    <>
      <aside className="hidden w-72 border-r border-app bg-surface p-5 lg:block">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isMobileOpen ? (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="Close sidebar overlay" />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.25 }}
              className="relative h-full w-72 border-r border-app bg-surface p-5 shadow-2xl"
            >
              <button className="mb-4 inline-flex rounded-xl border border-app p-2 text-muted" onClick={onClose} aria-label="Close sidebar">
                <X size={16} />
              </button>
              <SidebarContent onLinkClick={onClose} />
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
