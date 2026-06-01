import { cn } from "@/lib/cn";

/** Shimmering placeholder block. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-[linear-gradient(90deg,var(--color-surface-2)_25%,var(--color-surface-3)_50%,var(--color-surface-2)_75%)] bg-[length:200%_100%] animate-shimmer",
        className,
      )}
    />
  );
}
