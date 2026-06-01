import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TabDef {
  id: string;
  label: ReactNode;
  count?: number;
}

/** Underline-style tab bar. Controlled via value/onChange. */
export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: TabDef[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1 border-b border-hairline", className)}>
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative -mb-px flex items-center gap-2 px-3 py-2.5 text-body-sm font-medium transition-colors",
              active ? "text-ink" : "text-ink-subtle hover:text-ink-muted",
            )}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-px text-[0.6875rem] tabular-nums",
                  active ? "bg-surface-3 text-ink-muted" : "bg-surface-2 text-ink-subtle",
                )}
              >
                {t.count}
              </span>
            )}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Pill-style segmented control (e.g. SPDX / CycloneDX). */
export function Segmented({
  options,
  value,
  onChange,
  className,
}: {
  options: { id: string; label: ReactNode }[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full bg-surface-2 p-0.5 ring-1 ring-inset ring-hairline",
        className,
      )}
    >
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={cn(
              "rounded-full px-3 py-1 text-caption font-medium transition-colors",
              active
                ? "bg-surface-4 text-ink ring-1 ring-inset ring-hairline-strong"
                : "text-ink-subtle hover:text-ink",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
