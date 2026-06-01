import { Link } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import EmptyState from "../components/ui/EmptyState";
import PageTransition from "../components/ui/PageTransition";

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add products from shops to start checkout."
        action={
          <Link to="/" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
            Continue shopping
          </Link>
        }
      />
    );
  }

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Shopping Cart</h1>
        <button onClick={clearCart} className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50">
          Clear cart
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr,1fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.product._id} className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              {item.product.images?.[0] ? (
                <img src={item.product.images[0]} alt={item.product.name} className="h-24 w-24 rounded-xl object-cover" />
              ) : null}

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-1 font-semibold text-slate-900">{item.product.name}</h3>
                <p className="text-sm text-cyan-700">${Number(item.product.price).toFixed(2)}</p>
                <div className="mt-3 flex items-center gap-2">
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

              <p className="text-sm font-semibold text-slate-700">${(item.product.price * item.quantity).toFixed(2)}</p>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            {items.map((item) => (
              <div key={item.product._id} className="flex justify-between gap-3">
                <span className="line-clamp-1">{item.product.name} x{item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-200 pt-4 text-lg font-bold text-slate-900">
            <div className="flex justify-between">
              <span>Total</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
          </div>
          <button className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500">
            Proceed to checkout
          </button>
          <Link to="/" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 hover:text-cyan-600">
            <ArrowLeft size={14} /> Continue shopping
          </Link>
        </aside>
      </div>
    </PageTransition>
  );
}