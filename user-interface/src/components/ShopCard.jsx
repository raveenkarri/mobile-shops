import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';

export default function ShopCard({ shop }) {
  return (
    <Link to={`/shop/${shop._id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <Store className="text-blue-600" size={28} />
          <h3 className="text-xl font-semibold">{shop.shopName}</h3>
        </div>
        <p className="text-gray-600 mb-2">📍 {shop.location}</p>
        <p className="text-gray-500 text-sm">{shop.description || 'No description'}</p>
        <div className="mt-4">
          <span className="text-blue-600 text-sm font-medium">View Products →</span>
        </div>
      </div>
    </Link>
  );
}