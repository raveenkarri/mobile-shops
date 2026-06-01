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
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");
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
            category,
            sortBy,
          },
        });
        setShops(data.shops || []);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [debouncedSearch, debouncedLocation, category, sortBy]);

  return (
    <PageTransition className="space-y-7">
      <div className="surface p-5">
        <h1 className="text-3xl font-bold text-primary">Find trusted mobile shops nearby</h1>
        <p className="mt-2 text-sm text-muted">Search by name, location, keywords, and discover the best offers instantly.</p>
      </div>

      <BannerCarousel banners={banners} />

      <div className="surface grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="relative block md:col-span-2 xl:col-span-2">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by shop, location, or keywords"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input pl-10"
          />
        </label>

        <input
          type="text"
          placeholder="Location filter"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="input"
        />

        <select value={category} onChange={(event) => setCategory(event.target.value)} className="input">
          <option value="">All categories</option>
          <option value="mobile_store">Mobile Store</option>
          <option value="repair_center">Repair Center</option>
          <option value="multi_brand">Multi Brand</option>
          <option value="accessories_specialist">Accessories Specialist</option>
        </select>

        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="input">
          <option value="latest">Latest</option>
          <option value="popularity">Popularity</option>
          <option value="rating">Rating</option>
          <option value="name">Name</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-56" />
          ))}
        </div>
      ) : shops.length === 0 ? (
        <EmptyState title="No shops matched" description="Try different keywords, category, or location filters." />
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
