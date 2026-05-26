import { useCartStore } from '../store/cartStore';
import { Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/" className="text-blue-600 hover:underline">Continue Shopping</Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <button onClick={clearCart} className="text-red-500 hover:text-red-600">
          Clear Cart
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product._id} className="bg-white rounded-xl shadow-md p-4 flex gap-4">
              {item.product.images?.[0] && (
                <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-24 object-cover rounded" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.product.name}</h3>
                <p className="text-blue-600">${item.product.price}</p>
                <div className="flex items-center gap-3 mt-2">
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
              <div className="text-right">
                <p className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.product._id} className="flex justify-between text-sm">
                <span>{item.product.name} x{item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mb-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
          </div>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Proceed to Checkout
          </button>
          <Link to="/" className="block text-center mt-4 text-blue-600 hover:underline flex items-center justify-center gap-1">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}