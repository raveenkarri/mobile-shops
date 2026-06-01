import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MessageCircle } from "lucide-react";
import ProductCard from "../components/ProductCard";
import BannerCarousel from "../components/BannerCarousel";
import EmptyState from "../components/ui/EmptyState";
import PageTransition from "../components/ui/PageTransition";
import Skeleton from "../components/ui/Skeleton";
import { useAuthStore } from "../store/authStore";
import apiClient from "../lib/apiClient";

export default function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        const [shopRes, productRes, bannerRes] = await Promise.all([
          apiClient.get(`/shops/${id}`),
          apiClient.get(`/products/shop/${id}`),
          apiClient.get(`/banners/shop/${id}`),
        ]);

        setShop(shopRes.data);
        setProducts(productRes.data.products || []);
        setBanners(bannerRes.data || []);
      } catch {
        setShop(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [id]);

  const startChat = async () => {
    if (!user) {
      toast.error("Please login to chat with shop owner");
      navigate("/login");
      return;
    }

    try {
      const { data } = await apiClient.post("/chats", { shopId: id });
      navigate(`/chat/${data._id}`);
    } catch {
      toast.error("Failed to start chat");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-72" />
          ))}
        </div>
      </div>
    );
  }

  if (!shop) {
    return <EmptyState title="Shop not found" description="This shop may have been removed." />;
  }

  return (
    <PageTransition className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">{shop.shopName}</h1>
        <p className="mt-1 text-sm text-slate-500">{shop.location}</p>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600">{shop.description || "No description available"}</p>
        {user ? (
          <button
            onClick={startChat}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            <MessageCircle size={16} />
            Chat with owner
          </button>
        ) : null}
      </div>

      <BannerCarousel banners={banners} />

      {products.length === 0 ? (
        <EmptyState title="No products listed" description="This shop has not published products yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </PageTransition>
  );
}