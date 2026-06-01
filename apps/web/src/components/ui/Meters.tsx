import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Thin horizontal score bar (0..1 fraction) with a hex color. */
export function ScoreBar({
  value,
  hex = "#5e6ad2",
  className,
  height = 6,
}: {
  value: number;
  hex?: string;
  className?: string;
  height?: number;
}) {
  return (
    <div
      className={cn("w-full overflow-hidden rounded-full bg-surface-3", className)}
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-700"
        style={{
          width: `${Math.max(0, Math.min(1, value)) * 100}%`,
          backgroundColor: hex,
        }}
      />
    </div>
  );
}

/** Circular progress ring with a centered label. */
export function ProgressRing({
  value,
  size = 120,
  stroke = 9,
  hex = "#5e6ad2",
  trackHex = "#23252a",
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  hex?: string;
  trackHex?: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value));

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackHex}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={hex}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

/** Segmented severity bar - proportional stack of counts. */
export function SegmentBar({
  segments,
  className,
  height = 8,
}: {
  segments: { value: number; hex: string; label?: string }[];
  className?: string;
  height?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div
      className={cn("flex w-full overflow-hidden rounded-full bg-surface-3", className)}
      style={{ height }}
    >
      {segments.map((s, i) =>
        s.value > 0 ? (
          <div
            key={i}
            style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.hex }}
            title={s.label}
          />
        ) : null,
      )}
    </div>
  );
}
