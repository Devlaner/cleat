import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEscape } from "@/lib/hooks";

/** Right-side slide-in panel for detail/remediation views. */
export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width = 460,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  useEscape(onClose, open);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="panel-highlight absolute inset-y-0 right-0 flex flex-col border-l border-hairline-strong bg-surface-1 shadow-overlay"
            style={{ width: `min(${width}px, 100vw)` }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 38 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-hairline p-4">
              <div className="min-w-0">
                <h2 className="text-card-title font-medium text-ink">{title}</h2>
                {description && (
                  <p className="mt-0.5 text-caption text-ink-subtle">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="-m-1 rounded-md p-1.5 text-ink-tertiary transition-colors hover:bg-surface-2 hover:text-ink"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
            {footer && <div className="border-t border-hairline p-4">{footer}</div>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
