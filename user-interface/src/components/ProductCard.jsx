import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCartStore } from "../store/cartStore";

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.article whileHover={{ y: -4 }} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="h-52 bg-slate-100">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-sm text-slate-500">No image</div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">{product.name}</h3>
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">{product.category}</p>
        <p className="text-2xl font-bold text-cyan-700">${Number(product.price).toFixed(2)}</p>
        <p className="text-sm text-slate-500">Stock: {product.stock}</p>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <ShoppingCart size={16} />
          {product.stock === 0 ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </motion.article>
  );
}