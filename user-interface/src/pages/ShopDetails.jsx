import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MessageCircle } from "lucide-react";
import ProductCard from "../components/ProductCard";
import BannerCarousel from "../components/BannerCarousel";
import ProductGalleryModal from "../components/ui/ProductGalleryModal";
import EmptyState from "../components/ui/EmptyState";
import PageTransition from "../components/ui/PageTransition";
import Skeleton from "../components/ui/Skeleton";
import { useAuthStore } from "../store/authStore";
import apiClient from "../lib/apiClient";

export default function ShopDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [galleryProduct, setGalleryProduct] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      try {
        const shopRes = await apiClient.get(`/shops/slug/${slug}`);
        const shopId = shopRes.data._id;
        const [productRes, bannerRes] = await Promise.all([
          apiClient.get(`/products/shop/${shopId}`),
          apiClient.get(`/banners/shop/${shopId}`),
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
  }, [slug]);

  const startChat = async () => {
    if (!user) {
      toast.error("Please login to chat with shop owner");
      navigate("/login");
      return;
    }

    try {
      const { data } = await apiClient.post("/chats", { shopId: shop._id });
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
      <div className="surface p-6">
        <h1 className="text-3xl font-bold text-primary">{shop.shopName}</h1>
        <p className="mt-1 text-sm text-muted">{shop.location}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-app px-2.5 py-1 text-muted">{shop.category?.replaceAll("_", " ")}</span>
          <span className="rounded-full border border-app px-2.5 py-1 text-muted">Rating {Number(shop.rating || 0).toFixed(1)}</span>
        </div>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted">{shop.description || "No description available"}</p>
        {user ? (
          <button
            onClick={startChat}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
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
            <ProductCard key={product._id} product={product} onOpenGallery={setGalleryProduct} />
          ))}
        </div>
      )}

      <ProductGalleryModal open={Boolean(galleryProduct)} product={galleryProduct} onClose={() => setGalleryProduct(null)} />
    </PageTransition>
  );
}
