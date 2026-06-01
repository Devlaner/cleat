import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Side = "top" | "right" | "bottom" | "left";

const SIDE: Record<Side, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
};

/** CSS-only tooltip: appears on hover/focus of the wrapped element. */
export function Tooltip({
  label,
  side = "top",
  children,
  className,
}: {
  label: ReactNode;
  side?: Side;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("group/tt relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 hidden whitespace-nowrap rounded-md bg-surface-3 px-2 py-1 text-caption text-ink",
          "ring-1 ring-hairline-strong shadow-pop",
          "group-hover/tt:block group-focus-within/tt:block",
          SIDE[side],
        )}
      >
        {label}
      </span>
    </span>
  );
}
