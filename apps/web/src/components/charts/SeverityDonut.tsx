import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useReducedMotion } from "motion/react";
import { SEVERITY, SEVERITY_ORDER } from "@/lib/severity";
import type { SeverityCounts } from "@/data/metrics";
import { ChartTooltipBox } from "./ChartTooltip";
import type { Severity } from "@cleat/contracts";

export function SeverityDonut({ counts, size = 180 }: { counts: SeverityCounts; size?: number }) {
  const reduce = useReducedMotion();
  const data = SEVERITY_ORDER.map((s) => ({
    severity: s,
    name: SEVERITY[s].label,
    value: counts[s],
    hex: SEVERITY[s].hex,
  })).filter((d) => d.value > 0);
  const total = data.reduce((s, d) => s + d.value, 0);
  const label = `Findings by severity: ${total} total. ${SEVERITY_ORDER.filter((s) => counts[s] > 0)
    .map((s) => `${counts[s]} ${SEVERITY[s].label.toLowerCase()}`)
    .join(", ")}.`;

  return (
    <div className="relative" style={{ width: size, height: size }} role="img" aria-label={label}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={size * 0.32}
            outerRadius={size * 0.48}
            paddingAngle={2}
            stroke="none"
            isAnimationActive={!reduce}
          >
            {data.map((d) => (
              <Cell key={d.severity} fill={d.hex} />
            ))}
          </Pie>
          <Tooltip
            wrapperStyle={{ zIndex: 50 }}
            content={({ active, payload }) =>
              active && payload?.length ? (
                <ChartTooltipBox
                  rows={[
                    {
                      label: String(payload[0]!.name),
                      value: payload[0]!.value as number,
                      hex: (payload[0]!.payload as { hex: string }).hex,
                    },
                  ]}
                />
              ) : null
            }
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center">
        <span className="text-headline font-semibold tabular-nums text-ink">{total}</span>
        <span className="text-caption text-ink-subtle">findings</span>
      </div>
    </div>
  );
}

/** Legend list for a severity donut. */
export function SeverityLegend({ counts }: { counts: SeverityCounts }) {
  return (
    <div className="space-y-1.5">
      {SEVERITY_ORDER.filter((s) => counts[s] > 0).map((s) => (
        <div key={s} className="flex items-center gap-2 text-body-sm">
          <span className="size-2 rounded-full" style={{ backgroundColor: SEVERITY[s].hex }} />
          <span className="text-ink-muted">{SEVERITY[s].label}</span>
          <span className="ml-auto font-medium tabular-nums text-ink">{counts[s as Severity]}</span>
        </div>
      ))}
    </div>
  );
}
