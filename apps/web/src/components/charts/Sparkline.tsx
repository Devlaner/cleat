import { Line, LineChart, ResponsiveContainer } from "recharts";

/** Minimal inline trend line. */
export function Sparkline({
  data,
  dataKey = "value",
  hex = "#5e6ad2",
  height = 36,
}: {
  data: { [k: string]: number }[];
  dataKey?: string;
  hex?: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line type="monotone" dataKey={dataKey} stroke={hex} strokeWidth={1.75} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
