import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Store } from "lucide-react";

export default function ShopCard({ shop }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Link
        to={`/shop/${shop._id}`}
        className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg"
      >
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-xl bg-cyan-100 p-2 text-cyan-700">
            <Store size={20} />
          </div>
          <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">{shop.shopName}</h3>
        </div>

        <p className="flex items-center gap-1 text-sm text-slate-500">
          <MapPin size={14} />
          {shop.location}
        </p>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{shop.description || "No description available."}</p>

        <span className="mt-5 text-sm font-semibold text-cyan-700">View products</span>
      </Link>
    </motion.div>
  );
}