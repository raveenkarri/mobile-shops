import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSocketStore } from '../store/socketStore';
import { useAuthStore } from '../store/authStore';
import { Send, ArrowLeft } from 'lucide-react';

export default function UserChat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { socket, connect, getSocket } = useSocketStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (!socket && user) {
      connect(localStorage.getItem('token') || '');
    }
    fetchMessages();
    
    const currentSocket = getSocket();
    if (currentSocket) {
      currentSocket.emit('join_chat', { chatId });
      
      currentSocket.on('receive_message', (message) => {
        setMessages((prev) => [...prev, message]);
      });
      
      currentSocket.on('user_typing', ({ userId, isTyping }) => {
        if (userId !== user?._id) setTyping(isTyping);
      });
    }
    
    return () => {
      if (currentSocket) {
        currentSocket.off('receive_message');
        currentSocket.off('user_typing');
      }
    };
  }, [chatId, user]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/chats/${chatId}/messages`);
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const socket = getSocket();
    if (socket) {
      socket.emit('send_message', { chatId, message: newMessage });
      setNewMessage('');
    }
  };
  
  const handleTyping = () => {
    const socket = getSocket();
    if (socket) {
      socket.emit('typing', { chatId, isTyping: true });
      setTimeout(() => {
        socket.emit('typing', { chatId, isTyping: false });
      }, 1000);
    }
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-xl shadow-md">
      <div className="flex items-center gap-4 p-4 border-b">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-semibold">Chat with Shop Owner</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.senderId === user?._id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{msg.message}</p>
              <p className="text-xs opacity-75 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {typing && (
          <div className="text-sm text-gray-500 italic">Owner is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="border-t p-4 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyUp={handleTyping}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}