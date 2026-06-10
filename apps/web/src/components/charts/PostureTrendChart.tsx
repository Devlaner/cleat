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
import type { PostureTrendPoint } from "@cleat/contracts";
import { shortDate } from "@/lib/format";
import { ChartTooltipBox } from "./ChartTooltip";

export function PostureTrendChart({
  data,
  height = 200,
}: {
  data: PostureTrendPoint[];
  height?: number;
}) {
  const reduce = useReducedMotion();
  const first = data[0]?.score ?? 0;
  const last = data[data.length - 1]?.score ?? 0;
  const delta = last - first;
  const label = `Security posture trend over ${data.length} days. Currently ${last}, ${delta >= 0 ? "up" : "down"} ${Math.abs(delta)} over the period.`;

  return (
    <div role="img" aria-label={label}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="posture-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5e6ad2" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#5e6ad2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#23252a" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => shortDate(v)}
            tick={{ fill: "#62666d", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            minTickGap={36}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#62666d", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            cursor={{ stroke: "#34343a" }}
            content={({ active, payload }) =>
              active && payload?.length ? (
                <ChartTooltipBox
                  title={shortDate(String(payload[0]!.payload.date))}
                  rows={[
                    { label: "Posture score", value: payload[0]!.value as number, hex: "#5e6ad2" },
                  ]}
                />
              ) : null
            }
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#5e6ad2"
            strokeWidth={2}
            fill="url(#posture-grad)"
            isAnimationActive={!reduce}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
