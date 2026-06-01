import { useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Modal({
  open,
  onClose,
  children,
  title,
  description,
  width = "max-w-lg",
  closeOnEsc = true,
}) {
  const previousOverflowRef = useRef("");
  const contentRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Keep latest onClose in a ref so effect doesn't re-attach listeners
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Manage body overflow and html background when modal opens/closes
  useEffect(() => {
    if (open) {
      // Save current values
      previousOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      // Force a dark background behind the overlay (eliminates white strip)
      document.documentElement.style.backgroundColor = "#111"; // match overlay tone
    }

    return () => {
      if (open) {
        document.body.style.overflow = previousOverflowRef.current;
        document.documentElement.style.backgroundColor = ""; // restore original
      }
    };
  }, [open]);

  // Esc key handler
  const handleEsc = useCallback(
    (event) => {
      if (closeOnEsc && event.key === "Escape") {
        onCloseRef.current?.();
      }
    },
    [closeOnEsc],
  );

  useEffect(() => {
    if (!open) return;

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, handleEsc]);

  // Focus trap
  useEffect(() => {
    if (!open || !contentRef.current) return;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const content = contentRef.current;

    // Focus first focusable element (or wrapper)
    const focusableElements = content.querySelectorAll(focusableSelector);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      content.focus(); // needs tabIndex={-1} already set
    }

    const trapFocus = (e) => {
      const focusable = content.querySelectorAll(focusableSelector);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    content.addEventListener("keydown", trapFocus);
    return () => content.removeEventListener("keydown", trapFocus);
  }, [open]);

  // Close on overlay click (only if overlay itself is clicked)
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onCloseRef.current?.();
    }
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          // Outer container: no padding – let the overlay fill everything
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
          aria-modal="true"
          role="dialog"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby={description ? "modal-desc" : undefined}
        >
          {/* Fixed overlay: covers entire viewport, immune to parent layout */}
          <div className="fixed inset-0 bg-black/55 backdrop-blur-sm" />

          {/* Centering wrapper with internal padding (horizontal + vertical) */}
          <div className="relative w-full p-4 sm:p-6 flex justify-center">
            <motion.div
              ref={contentRef}
              tabIndex={-1}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`w-full ${width} rounded-3xl border border-app bg-surface p-6 shadow-2xl`}
            >
              {title && (
                <h2 id="modal-title" className="sr-only">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-desc" className="sr-only">
                  {description}
                </p>
              )}
              {children}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
