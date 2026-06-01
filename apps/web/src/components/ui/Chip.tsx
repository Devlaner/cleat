import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** A small monogram chip used for ecosystems / providers (npm, AWS, …). */
export function MonoChip({
  short,
  hex,
  className,
}: {
  short: string;
  hex: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded px-1 font-mono text-[0.6875rem] font-semibold leading-none",
        className,
      )}
      style={{
        color: hex,
        backgroundColor: `color-mix(in srgb, ${hex} 16%, transparent)`,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${hex} 30%, transparent)`,
      }}
    >
      {short}
    </span>
  );
}

/** Generic scope/permission chip (e.g. OAuth scopes). */
export function ScopeChip({ children, danger }: { children: ReactNode; danger?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 font-mono text-[0.6875rem] ring-1 ring-inset",
        danger
          ? "bg-critical/8 text-critical ring-critical/25"
          : "bg-surface-3 text-ink-muted ring-hairline",
      )}
    >
      {children}
    </span>
  );
}
