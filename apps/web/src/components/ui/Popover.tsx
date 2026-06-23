import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { useClickOutside, useEscape } from "@/lib/hooks";

type Align = "start" | "end" | "center";

/**
 * Lightweight popover: a trigger that toggles a floating panel, closing on
 * outside-click or Escape. `render` receives a close() callback.
 */
export function Popover({
  trigger,
  children,
  align = "start",
  width,
  className,
  panelClassName,
}: {
  trigger: (open: boolean) => ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  align?: Align;
  width?: number | string;
  className?: string;
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const ref = useClickOutside<HTMLDivElement>(close, open);
  useEscape(close, open);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
  block min-h-12 w-full rounded-md px-3 text-left transition-colors
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-primary
  focus-visible:ring-offset-2
"
        aria-expanded={open}
      >
        {trigger(open)}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.13, ease: [0.16, 1, 0.3, 1] }}
            style={{ width }}
            className={cn(
              "absolute z-50 mt-2 origin-top rounded-lg border border-hairline-strong bg-surface-2 p-1.5 shadow-overlay",
              align === "end" && "right-0",
              align === "center" && "left-1/2 -translate-x-1/2",
              panelClassName,
            )}
          >
            <div className="flex flex-col gap-1">
              {typeof children === "function" ? children(close) : children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A row inside a popover menu. */
export function MenuItem({
  icon,
  children,
  onClick,
  active,
  danger,
  trailing,
}: {
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  danger?: boolean;
  trailing?: ReactNode;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex min-h-12 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-body-sm transition-colors",
        danger
          ? "text-critical hover:bg-critical/10"
          : "text-ink-muted hover:bg-surface-3 hover:text-ink",
        active && "bg-surface-3 text-ink",
      )}
    >
      {icon && <span className="shrink-0 text-current opacity-80">{icon}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {trailing}
    </button>
  );
}
