import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Store } from "lucide-react";

export default function ShopCard({ shop }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Link
        to={`/shop/${shop.slug}`}
        className="surface flex h-full flex-col p-5 transition hover:shadow-lg"
      >
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-xl bg-base p-2 text-accent">
            <Store size={20} />
          </div>
          <h3 className="line-clamp-1 text-lg font-semibold text-primary">{shop.shopName}</h3>
        </div>

        <p className="flex items-center gap-1 text-sm text-muted">
          <MapPin size={14} />
          {shop.location}
        </p>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{shop.description || "No description available."}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-app px-2.5 py-1 text-muted">{shop.category?.replaceAll("_", " ") || "shop"}</span>
          <span className="rounded-full border border-app px-2.5 py-1 text-muted">Rating {Number(shop.rating || 0).toFixed(1)}</span>
        </div>

        <span className="mt-5 text-sm font-semibold text-accent">View products</span>
      </Link>
    </motion.div>
  );
}
