import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useReducedMotion } from "motion/react";
import type { UsagePoint } from "@/data/types";
import { currency } from "@/lib/format";
import { ChartTooltipBox } from "./ChartTooltip";

export function CostAreaChart({ data, height = 200 }: { data: UsagePoint[]; height?: number }) {
  const reduce = useReducedMotion();
  const last = data[data.length - 1]?.cost ?? 0;
  const label = `Monthly spend trend over ${data.length} months. Latest ${currency(last)}.`;

  return (
    <div role="img" aria-label={label}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="cost-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#828fff" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#828fff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#23252a" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#62666d", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            minTickGap={16}
          />
          <YAxis
            tickFormatter={(v) => `$${v}`}
            tick={{ fill: "#62666d", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            cursor={{ stroke: "#34343a" }}
            content={({ active, payload }) =>
              active && payload?.length ? (
                <ChartTooltipBox
                  title={String(payload[0]!.payload.label)}
                  rows={[
                    {
                      label: "Spend",
                      value: currency(payload[0]!.value as number),
                      hex: "#828fff",
                    },
                  ]}
                />
              ) : null
            }
          />
          <Area
            type="monotone"
            dataKey="cost"
            stroke="#828fff"
            strokeWidth={2}
            fill="url(#cost-grad)"
            isAnimationActive={!reduce}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
