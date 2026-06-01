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
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <h2 className="text-xl font-bold text-slate-900">Cart</h2>
              <button onClick={onClose} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {items.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-500">Your cart is empty</p>
              ) : (
                items.map((item) => (
                  <div key={item.product._id} className="flex gap-3 rounded-2xl border border-slate-200 p-3">
                    {item.product.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="h-20 w-20 rounded-xl object-cover" />
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-1 font-semibold text-slate-900">{item.product.name}</h3>
                      <p className="text-sm text-cyan-700">${Number(item.product.price).toFixed(2)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <select
                          value={item.quantity}
                          onChange={(event) => updateQuantity(item.product._id, Number(event.target.value))}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                        >
                          {[...Array(10).keys()].map((i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <button onClick={() => removeItem(item.product._id)} className="text-rose-600 hover:text-rose-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 ? (
              <div className="space-y-3 border-t border-slate-200 p-4">
                <div className="flex items-center justify-between text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="block rounded-xl bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-slate-800"
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