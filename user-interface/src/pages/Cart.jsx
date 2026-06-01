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
          <Link to="/" className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">
            Continue shopping
          </Link>
        }
      />
    );
  }

  return (
    <PageTransition className="space-y-6">
      <div className="surface flex flex-wrap items-center justify-between gap-3 p-5">
        <h1 className="text-2xl font-bold text-primary">Shopping Cart</h1>
        <button onClick={clearCart} className="rounded-xl border border-rose-400/40 px-3 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-500/10">
          Clear cart
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr,1fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.product._id} className="surface flex gap-4 p-4">
              {item.product.images?.[0] ? (
                <img src={item.product.images[0]} alt={item.product.name} className="h-24 w-24 rounded-xl object-cover" />
              ) : null}

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-1 font-semibold text-primary">{item.product.name}</h3>
                <p className="text-sm text-accent">{"\u20B9"}{Number(item.product.pricing?.discountedPrice ?? item.product.price).toFixed(2)}</p>
                <div className="mt-3 flex items-center gap-2">
                  <select
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.product._id, Number(event.target.value))}
                    className="rounded-lg border border-app bg-surface px-2 py-1 text-sm"
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

              <p className="text-sm font-semibold text-primary">{"\u20B9"}{((item.product.pricing?.discountedPrice ?? item.product.price) * item.quantity).toFixed(2)}</p>
            </article>
          ))}
        </div>

        <aside className="surface h-fit p-5">
          <h2 className="text-lg font-bold text-primary">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm text-muted">
            {items.map((item) => (
              <div key={item.product._id} className="flex justify-between gap-3">
                <span className="line-clamp-1">{item.product.name} x{item.quantity}</span>
                <span>{"\u20B9"}{((item.product.pricing?.discountedPrice ?? item.product.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-app pt-4 text-lg font-bold text-primary">
            <div className="flex justify-between">
              <span>Total</span>
              <span>{"\u20B9"}{getTotal().toFixed(2)}</span>
            </div>
          </div>
          <button className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">
            Proceed to checkout
          </button>
          <Link to="/" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:opacity-80">
            <ArrowLeft size={14} /> Continue shopping
          </Link>
        </aside>
      </div>
    </PageTransition>
  );
}