import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ShopSetup() {
  const [shop, setShop] = useState(null);
  const [formData, setFormData] = useState({
    shopName: '',
    location: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchMyShop();
  }, []);
  
  const fetchMyShop = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/shops/my-shop');
      setShop(data);
      setFormData({
        shopName: data.shopName,
        location: data.location,
        description: data.description || '',
      });
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load shop');
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (shop) {
        await axios.put('http://localhost:5000/api/shops/my-shop', formData);
        toast.success('Shop updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/shops', formData);
        toast.success('Shop created successfully');
        fetchMyShop();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving shop');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{shop ? 'Edit Shop' : 'Create Your Shop'}</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
          <input
            type="text"
            required
            value={formData.shopName}
            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location / Area</label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Downtown, City Center"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : shop ? 'Update Shop' : 'Create Shop'}
        </button>
      </form>
    </div>
  );
}