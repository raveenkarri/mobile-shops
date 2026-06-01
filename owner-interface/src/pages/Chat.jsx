import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Send } from "lucide-react";
import { useSocketStore } from "../store/socketStore";
import { useAuthStore } from "../store/authStore";
import PageTransition from "../components/ui/PageTransition";
import apiClient from "../lib/apiClient";

export default function Chat() {
  const { chatId } = useParams();
  const user = useAuthStore((state) => state.user);
  const { socket, connect, getSocket } = useSocketStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket && user) {
      connect();
    }
  }, [socket, user, connect]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await apiClient.get(`/chats/${chatId}/messages`);
      setMessages(data);
    };

    fetchMessages();

    const currentSocket = getSocket();
    if (!currentSocket) return;

    currentSocket.emit("join_chat", { chatId });

    currentSocket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    currentSocket.on("user_typing", ({ userId, isTyping }) => {
      if (userId !== user?._id) {
        setTyping(isTyping);
      }
    });

    return () => {
      currentSocket.off("receive_message");
      currentSocket.off("user_typing");
    };
  }, [chatId, getSocket, user?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (!newMessage.trim()) return;

    const activeSocket = getSocket();
    if (activeSocket) {
      activeSocket.emit("send_message", { chatId, message: newMessage.trim() });
      setNewMessage("");
    }
  };

  const handleTyping = () => {
    const activeSocket = getSocket();
    if (activeSocket) {
      activeSocket.emit("typing", { chatId, isTyping: true });
      setTimeout(() => activeSocket.emit("typing", { chatId, isTyping: false }), 700);
    }
  };

  return (
    <PageTransition>
      <div className="flex h-[calc(100vh-180px)] flex-col overflow-hidden rounded-3xl border border-app bg-surface shadow-sm">
        <div className="border-b border-app px-5 py-4">
          <h3 className="text-lg font-semibold text-primary">Live conversation</h3>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-base p-4">
          {messages.map((msg) => (
            <div key={msg._id} className={`flex ${msg.senderId === user?._id ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.senderId === user?._id
                    ? "bg-accent text-white"
                    : "border border-app bg-surface text-primary"
                }`}
              >
                <p>{msg.message}</p>
                <p className="mt-1 text-[11px] opacity-70">{new Date(msg.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          {typing ? <p className="text-xs italic text-muted">Customer is typing...</p> : null}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="border-t border-app p-3">
          <div className="flex items-center gap-2 rounded-2xl border border-app bg-surface p-2">
            <input
              type="text"
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              onKeyUp={handleTyping}
              placeholder="Type your reply..."
              className="flex-1 bg-transparent px-2 py-1 text-sm text-primary focus:outline-none"
            />
            <button type="submit" className="rounded-xl bg-accent p-2 text-white hover:opacity-90">
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
