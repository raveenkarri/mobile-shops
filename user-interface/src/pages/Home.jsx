import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import BannerCarousel from "../components/BannerCarousel";
import ShopCard from "../components/ShopCard";
import EmptyState from "../components/ui/EmptyState";
import PageTransition from "../components/ui/PageTransition";
import Skeleton from "../components/ui/Skeleton";
import apiClient from "../lib/apiClient";
import useDebounce from "../lib/useDebounce";

export default function Home() {
  const [shops, setShops] = useState([]);
  const [banners, setBanners] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 450);
  const debouncedLocation = useDebounce(location, 450);

  useEffect(() => {
    const fetchGlobalBanners = async () => {
      try {
        const { data } = await apiClient.get("/banners/global");
        setBanners(data || []);
      } catch {
        setBanners([]);
      }
    };

    fetchGlobalBanners();
  }, []);

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get("/shops", {
          params: {
            search: debouncedSearch,
            location: debouncedLocation,
          },
        });
        setShops(data.shops || []);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [debouncedSearch, debouncedLocation]);

  return (
    <PageTransition className="space-y-7">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Find the best mobile shops near you</h1>
        <p className="mt-2 text-sm text-slate-600">Browse shops, compare products, and chat directly with owners before buying.</p>
      </div>

      <BannerCarousel banners={banners} />

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
        <label className="relative block">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by shop name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-cyan-400 focus:outline-none"
          />
        </label>

        <input
          type="text"
          placeholder="Filter by location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-400 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-56" />
          ))}
        </div>
      ) : shops.length === 0 ? (
        <EmptyState
          title="No shops matched"
          description="Try a different keyword or location to discover more stores."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shops.map((shop) => (
            <ShopCard key={shop._id} shop={shop} />
          ))}
        </div>
      )}
    </PageTransition>
  );
}