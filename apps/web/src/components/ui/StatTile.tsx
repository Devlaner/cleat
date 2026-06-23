import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "./Card";

interface StatTileProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  /** signed percentage delta; sign + good/bad coloring driven by `goodDirection` */
  delta?: number;
  /** which direction is "good" for coloring the delta */
  goodDirection?: "up" | "down";
  hint?: ReactNode;
  accent?: string;
  className?: string;
  "data-testid"?: string;
}

export function StatTile({
  label,
  value,
  icon,
  delta,
  goodDirection = "up",
  hint,
  accent,
  className,
  "data-testid": dataTestId,
}: StatTileProps) {
  const hasDelta = typeof delta === "number";
  const isUp = (delta ?? 0) >= 0;
  const isGood = goodDirection === "up" ? isUp : !isUp;

  return (
    <Card data-testid={dataTestId} className={cn("relative overflow-hidden p-4", className)}>
      {accent && (
        <span
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />
      )}
      <div className="flex items-center justify-between">
        <span className="text-caption text-ink-subtle">{label}</span>
        {icon && <span className="text-ink-tertiary">{icon}</span>}
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-[1.75rem] leading-none font-semibold tracking-[-0.02em] text-ink tabular-nums">
          {value}
        </span>
        {hasDelta && (
          <span
            className={cn(
              "mb-0.5 inline-flex items-center gap-0.5 text-caption font-medium tabular-nums",
              isGood ? "text-success" : "text-critical",
            )}
          >
            {isUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {Math.abs(delta!)}%
          </span>
        )}
      </div>
      {hint && <p className="mt-1.5 text-caption text-ink-tertiary">{hint}</p>}
    </Card>
  );
}
