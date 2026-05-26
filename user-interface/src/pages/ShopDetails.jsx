import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';
import ProductCard from '../components/ProductCard';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function ShopDetails() {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  
  useEffect(() => {
    fetchShop();
    fetchProducts();
  }, [id]);
  
  const fetchShop = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/shops/${id}`);
      setShop(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/products/shop/${id}`);
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const startChat = async () => {
    if (!user) {
      toast.error('Please login to chat');
      return;
    }
    try {
      const { data } = await axios.post('http://localhost:5000/api/chats', { shopId: id });
      window.location.href = `/chat/${data._id}`;
    } catch (error) {
      toast.error('Failed to start chat');
    }
  };
  
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!shop) return <div className="text-center py-10">Shop not found</div>;
  
  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{shop.shopName}</h1>
        <p className="text-gray-600 mb-2">📍 {shop.location}</p>
        <p className="text-gray-700 mb-4">{shop.description}</p>
        {user && (
          <button
            onClick={startChat}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Chat with Shop
          </button>
        )}
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}