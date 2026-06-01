import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "../store/cartStore";

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const pricing = product.pricing || {
    originalPrice: Number(product.price || 0),
    discountedPrice: Number(product.price || 0),
    hasOffer: false,
    offer: null,
  };

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.article whileHover={{ y: -4 }} className="surface overflow-hidden">
      <div className="h-52 bg-base">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted">No image</div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-primary">{product.name}</h3>
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted">{product.category}</p>
        {pricing.hasOffer ? (
          <div>
            <p className="text-2xl font-bold text-accent">₹{Number(pricing.discountedPrice).toFixed(2)}</p>
            <p className="text-xs text-muted line-through">₹{Number(pricing.originalPrice).toFixed(2)}</p>
            <p className="mt-1 inline-flex rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400">
              {pricing.offer?.badgeText}
            </p>
          </div>
        ) : (
          <p className="text-2xl font-bold text-accent">₹{Number(product.price).toFixed(2)}</p>
        )}
        <p className="text-sm text-muted">Stock: {product.stock}</p>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <ShoppingCart size={16} />
          {product.stock === 0 ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </motion.article>
  );
}
