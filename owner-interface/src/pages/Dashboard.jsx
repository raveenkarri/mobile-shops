import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Package, Store } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import PageTransition from "../components/ui/PageTransition";
import Skeleton from "../components/ui/Skeleton";
import apiClient from "../lib/apiClient";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, chats: 0, banners: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, chatsRes, bannersRes] = await Promise.all([
          apiClient.get("/products/shop/my"),
          apiClient.get("/chats"),
          apiClient.get("/banners/my"),
        ]);

        setStats({
          products: productsRes.data.products?.length || 0,
          chats: chatsRes.data.length || 0,
          banners: bannersRes.data.length || 0,
        });
      } catch {
        setStats({ products: 0, chats: 0, banners: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = useMemo(
    () => [
      { title: "Products Live", value: stats.products, icon: Package, tone: "from-cyan-500 to-blue-500" },
      { title: "Open Conversations", value: stats.chats, icon: MessageCircle, tone: "from-emerald-500 to-teal-500" },
      { title: "Banner Campaigns", value: stats.banners, icon: Store, tone: "from-orange-500 to-amber-500" },
    ],
    [stats],
  );

  return (
    <PageTransition className="space-y-6">
      <div className="surface p-6">
        <p className="text-sm uppercase tracking-[0.16em] text-muted">Overview</p>
        <h2 className="mt-2 text-3xl font-bold text-primary">Scale faster, {user?.name?.split(" ")[0] || "Owner"}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">Your storefront is now optimized for richer merchandising and real-time customer engagement.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-36" />)
          : cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="surface p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted">{card.title}</p>
                    <p className="mt-2 text-4xl font-bold text-primary">{card.value}</p>
                  </div>
                  <div className={`rounded-2xl bg-gradient-to-br p-3 text-white shadow ${card.tone}`}>
                    <card.icon size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
      </div>
    </PageTransition>
  );
}
