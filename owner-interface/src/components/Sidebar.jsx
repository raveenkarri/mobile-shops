import { NavLink } from 'react-router-dom';
import { Home, Package, MessageCircle, Store } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/shop-setup', icon: Store, label: 'My Shop' },
    { to: '/products', icon: Package, label: 'Products' },
    { to: '/chats', icon: MessageCircle, label: 'Chats' },
  ];
  
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-800">Mobile Shop</div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}