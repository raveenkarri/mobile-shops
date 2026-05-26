import { useCartStore } from '../store/cartStore';
import { X, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.product._id} className="flex gap-4 border-b pb-4">
                {item.product.images?.[0] && (
                  <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-blue-600">${item.product.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <select
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value))}
                      className="border rounded px-2 py-1"
                    >
                      {[...Array(10).keys()].map(i => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <button onClick={() => removeItem(item.product._id)} className="text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {items.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
            <Link
              to="/cart"
              onClick={onClose}
              className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700"
            >
              View Cart & Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}