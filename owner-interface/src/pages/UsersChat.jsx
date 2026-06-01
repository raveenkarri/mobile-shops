import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import PageTransition from "../components/ui/PageTransition";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import apiClient from "../lib/apiClient";

export default function UsersChat() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await apiClient.get("/chats");
        setChats(data);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <PageTransition className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Customer conversations</h2>
        <p className="mt-1 text-sm text-slate-600">Respond quickly to improve conversion and trust.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24" />
          ))}
        </div>
      ) : chats.length === 0 ? (
        <EmptyState
          title="No chats yet"
          description="New customer conversations will appear here."
        />
      ) : (
        <div className="space-y-3">
          {chats.map((chat, index) => (
            <motion.div
              key={chat._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Link
                to={`/chat/${chat._id}`}
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-cyan-300 hover:shadow-md"
              >
                <div>
                  <p className="font-semibold text-slate-900">{chat.userId?.name || "Customer"}</p>
                  <p className="text-sm text-slate-500">Shop: {chat.shopId?.shopName || "Unknown"}</p>
                  <p className="mt-1 text-sm text-slate-600">{chat.lastMessage || "No messages yet"}</p>
                </div>
                <MessageCircle className="text-cyan-600 transition group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
