import { Link } from "react-router-dom";
import { X, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "../store/cartStore";

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-950/45" onClick={onClose} />
          <motion.aside
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-app p-4">
              <h2 className="text-xl font-bold text-primary">Cart</h2>
              <button onClick={onClose} className="rounded-lg p-1 text-muted hover:bg-base hover:text-primary">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {items.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted">Your cart is empty</p>
              ) : (
                items.map((item) => (
                  <div key={item.product._id} className="flex gap-3 rounded-2xl border border-app p-3">
                    {item.product.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="h-20 w-20 rounded-xl object-cover" />
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-1 font-semibold text-primary">{item.product.name}</h3>
                      <p className="text-sm text-accent">₹{Number(item.product.pricing?.discountedPrice ?? item.product.price).toFixed(2)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <select
                          value={item.quantity}
                          onChange={(event) => updateQuantity(item.product._id, Number(event.target.value))}
                          className="rounded-lg border border-app px-2 py-1 text-sm bg-surface"
                        >
                          {[...Array(10).keys()].map((i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <button onClick={() => removeItem(item.product._id)} className="text-rose-500 hover:text-rose-400">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 ? (
              <div className="space-y-3 border-t border-app p-4">
                <div className="flex items-center justify-between text-lg font-bold text-primary">
                  <span>Total</span>
                  <span>₹{getTotal().toFixed(2)}</span>
                </div>
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="block rounded-xl bg-accent px-4 py-2.5 text-center text-sm font-semibold text-white hover:opacity-90"
                >
                  View cart
                </Link>
              </div>
            ) : null}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
