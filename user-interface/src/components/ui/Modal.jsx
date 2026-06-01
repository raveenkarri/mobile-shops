import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Modal({ open, onClose, children, width = "max-w-lg", closeOnEsc = true }) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEsc = (event) => {
      if (closeOnEsc && event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, closeOnEsc, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} aria-label="Close modal overlay" />
          <div className="relative grid min-h-full place-items-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              className={`w-full ${width} max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border border-app bg-surface p-6 shadow-2xl`}
              onClick={(event) => event.stopPropagation()}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
