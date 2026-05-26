import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export default function UsersChat() {
  const [chats, setChats] = useState([]);
  
  useEffect(() => {
    fetchChats();
  }, []);
  
  const fetchChats = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/chats');
      setChats(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Customer Chats</h1>
      <div className="space-y-3">
        {chats.map((chat) => (
          <Link
            key={chat._id}
            to={`/chat/${chat._id}`}
            className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between hover:shadow-md transition"
          >
            <div>
              <p className="font-semibold">{chat.userId?.name || 'Customer'}</p>
              <p className="text-sm text-gray-500">Shop: {chat.shopId?.shopName}</p>
              <p className="text-sm text-gray-400">{chat.lastMessage || 'No messages yet'}</p>
            </div>
            <MessageCircle className="text-blue-500" />
          </Link>
        ))}
        {chats.length === 0 && (
          <p className="text-center text-gray-500 py-10">No chats yet</p>
        )}
      </div>
    </div>
  );
}