import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "./Card";

export interface SummaryItem {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: string;
  icon?: ReactNode;
}

/** A single card split into evenly divided stat columns. */
export function SummaryStats({ items, className }: { items: SummaryItem[]; className?: string }) {
  return (
    <Card className={cn("grid grid-cols-2 divide-hairline sm:flex sm:divide-x", className)}>
      {items.map((it, i) => (
        <div key={i} className={cn("flex-1 p-4", i >= 2 && "border-t border-hairline sm:border-t-0")}>
          <div className="flex items-center gap-1.5 text-caption text-ink-subtle">
            {it.icon}
            {it.label}
          </div>
          <p className={cn("mt-1 text-card-title font-semibold tabular-nums text-ink", it.tone)}>{it.value}</p>
          {it.hint && <p className="mt-0.5 text-caption text-ink-tertiary">{it.hint}</p>}
        </div>
      ))}
    </Card>
  );
}
