import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "./Modal";

const SWIPE_THRESHOLD = 50;

export default function ProductGalleryModal({ open, onClose, product }) {
  const images = useMemo(() => product?.images || [], [product]);
  const [activeIndex, setActiveIndex] = useState(0);
  const startXRef = useRef(null);

  const goPrev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % images.length);

  useEffect(() => {
    if (open) setActiveIndex(0);
  }, [open, product?._id]);

  useEffect(() => {
    if (!open || images.length < 2) return undefined;

    const handleKey = (event) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, images.length]);

  const onTouchStart = (event) => {
    startXRef.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event) => {
    if (startXRef.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? startXRef.current;
    const distance = endX - startXRef.current;
    if (distance > SWIPE_THRESHOLD) goPrev();
    if (distance < -SWIPE_THRESHOLD) goNext();
    startXRef.current = null;
  };

  if (!open || !product) return null;

  return (
    <Modal open={open} onClose={onClose} width="max-w-5xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-primary">{product.name}</h3>
          <p className="text-sm text-muted">Image gallery</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-xl border border-app p-2 text-muted hover:text-primary">
          <X size={16} />
        </button>
      </div>

      <div className="mt-4">
        {images.length ? (
          <>
            <div className="relative overflow-hidden rounded-2xl border border-app bg-base" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <motion.img
                key={`${images[activeIndex]}-${activeIndex}`}
                src={images[activeIndex]}
                alt={`${product.name} ${activeIndex + 1}`}
                initial={{ opacity: 0.5, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="h-[52vh] w-full object-contain sm:h-[60vh]"
              />

              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-xl bg-black/55 p-2 text-white hover:bg-black/70"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-black/55 p-2 text-white hover:bg-black/70"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              ) : null}
            </div>

            {images.length > 1 ? (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`overflow-hidden rounded-xl border ${
                      index === activeIndex ? "border-accent ring-2 ring-accent/20" : "border-app"
                    }`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="h-14 w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-2xl border border-app bg-base p-10 text-center text-sm text-muted">No images available</div>
        )}
      </div>
    </Modal>
  );
}
