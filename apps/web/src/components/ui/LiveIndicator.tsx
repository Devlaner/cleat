import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A quiet "live / freshly synced" status - a small breathing dot plus muted
 * text. Deliberately not a filled pill, so it reads as real product chrome.
 */
export function LiveIndicator({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-caption text-ink-subtle", className)}>
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60" />
        <span className="relative inline-flex size-1.5 rounded-full bg-success" />
      </span>
      {children}
    </span>
  );
}
