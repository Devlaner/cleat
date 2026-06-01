import type { ReactNode } from "react";

interface TooltipRow {
  label: string;
  value: ReactNode;
  hex?: string;
}

/** Shared dark tooltip body used by the Recharts wrappers. */
export function ChartTooltipBox({ title, rows }: { title?: string; rows: TooltipRow[] }) {
  return (
    <div className="rounded-lg border border-hairline-strong bg-surface-2 px-3 py-2 shadow-pop">
      {title && <p className="mb-1 text-caption text-ink-subtle">{title}</p>}
      <div className="space-y-0.5">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2 text-caption">
            {r.hex && <span className="size-2 rounded-full" style={{ backgroundColor: r.hex }} />}
            <span className="text-ink-subtle">{r.label}</span>
            <span className="ml-auto font-medium tabular-nums text-ink">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
