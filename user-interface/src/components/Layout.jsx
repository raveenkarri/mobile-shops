import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import CartDrawer from './CartDrawer';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">MobileShop</Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button onClick={() => setCartOpen(true)} className="relative">
                  <ShoppingCart className="text-gray-700" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
                <span className="text-gray-600">{user.name}</span>
                <button onClick={handleLogout} className="text-red-500">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}