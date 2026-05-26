import { useEffect, useState } from 'react';
import axios from 'axios';
import ShopCard from '../components/ShopCard';
import { Search } from 'lucide-react';

export default function Home() {
  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchShops();
    }, 500);
    return () => clearTimeout(debounce);
  }, [search, location]);
  
  const fetchShops = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/shops', {
        params: { search, location },
      });
      setShops(data.shops);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by shop name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Filter by location/area..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-10">Loading shops...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <ShopCard key={shop._id} shop={shop} />
          ))}
        </div>
      )}
      
      {shops.length === 0 && !loading && (
        <div className="text-center py-10 text-gray-500">No shops found</div>
      )}
    </div>
  );
}