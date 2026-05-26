import { useCartStore } from '../store/cartStore';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  
  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {product.images?.[0] && (
        <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-600 capitalize">{product.category}</p>
        <p className="text-2xl font-bold text-blue-600 mt-2">${product.price}</p>
        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}