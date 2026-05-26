import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Package, ShoppingBag, MessageCircle } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ products: 0, orders: 0, chats: 0 });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const products = await axios.get('http://localhost:5000/api/products/shop/my');
        const chats = await axios.get('http://localhost:5000/api/chats');
        setStats({
          products: products.data.products?.length || 0,
          orders: 0,
          chats: chats.data.length,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);
  
  const cards = [
    { title: 'Total Products', value: stats.products, icon: Package, color: 'bg-blue-500' },
    { title: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'bg-green-500' },
    { title: 'Active Chats', value: stats.chats, icon: MessageCircle, color: 'bg-purple-500' },
  ];
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user?.name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-full`}>
                <card.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}