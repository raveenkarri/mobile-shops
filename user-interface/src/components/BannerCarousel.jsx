import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const buildBadge = (banner) => {
  if (banner.type === "bogo") return "Buy 1 Get 1";
  if (banner.type === "combo_offer" && banner.freeProduct) return `Free ${banner.freeProduct}`;
  if (banner.discountType === "percentage") return `${banner.discountValue}% OFF`;
  if (banner.discountType === "fixed") return `Save ₹${banner.discountValue}`;
  return banner.title;
};

export default function BannerCarousel({ banners = [] }) {
  const activeBanners = useMemo(() => banners.filter((banner) => banner.isActive !== false), [banners]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  useEffect(() => {
    setIndex(0);
  }, [activeBanners.length]);

  if (!activeBanners.length) return null;

  const current = activeBanners[index];

  const goPrev = () => setIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  const goNext = () => setIndex((prev) => (prev + 1) % activeBanners.length);

  return (
    <div className="surface relative overflow-hidden p-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={current._id || index}
          initial={{ opacity: 0.2, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0.2, x: -20 }}
          transition={{ duration: 0.35 }}
          className="relative h-60 w-full sm:h-80"
        >
          <img src={current.image} alt={current.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent" />
          <div className="absolute bottom-0 left-0 z-10 max-w-xl p-5 sm:p-8">
            <p className="inline-flex rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">{buildBadge(current)}</p>
            <h3 className="mt-3 text-2xl font-bold text-white sm:text-4xl">{current.title}</h3>
            {current.description ? <p className="mt-2 text-sm text-slate-200">{current.description}</p> : null}
            {current.conditions?.minPurchaseAmount > 0 ? (
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.1em] text-cyan-200">
                On orders above ₹{current.conditions.minPurchaseAmount}
              </p>
            ) : null}
            {current.link ? (
              <a
                href={current.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200"
              >
                Explore Offer
              </a>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>

      {activeBanners.length > 1 ? (
        <>
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-xl bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
            aria-label="Previous banner"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-xl bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
            aria-label="Next banner"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 right-3 z-20 flex gap-1.5">
            {activeBanners.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => setIndex(dotIndex)}
                className={`h-2.5 rounded-full transition ${dotIndex === index ? "w-7 bg-white" : "w-2.5 bg-white/45"}`}
                aria-label={`Go to banner ${dotIndex + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
