import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, AlertTriangle, Info, X, Bell } from "lucide-react";
import { useUiStore, type ToastVariant } from "@/stores/useUiStore";
import { cn } from "@/lib/cn";

const ICONS: Record<ToastVariant, typeof Info> = {
  default: Bell,
  success: CheckCircle2,
  danger: AlertTriangle,
  info: Info,
};

const ACCENT: Record<ToastVariant, string> = {
  default: "text-ink-subtle",
  success: "text-success",
  danger: "text-critical",
  info: "text-low",
};

export function Toaster() {
  const toasts = useUiStore((s) => s.toasts);
  const dismiss = useUiStore((s) => s.dismissToast);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[22rem] max-w-[calc(100vw-2rem)] flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = ICONS[t.variant];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="panel-highlight pointer-events-auto flex items-start gap-3 rounded-lg border border-hairline-strong bg-surface-2 p-3 shadow-overlay"
            >
              <Icon className={cn("mt-0.5 size-4 shrink-0", ACCENT[t.variant])} />
              <div className="min-w-0 flex-1">
                <p className="text-body-sm font-medium text-ink">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-caption text-ink-subtle">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="-m-1 rounded p-1 text-ink-tertiary transition-colors hover:text-ink"
                aria-label="Dismiss"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
