import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SEVERITY, type Severity } from "@/lib/severity";

type Tone = "neutral" | "primary" | "success" | "danger" | "warning" | "muted";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-2 text-ink-muted ring-1 ring-inset ring-hairline",
  primary: "bg-primary/12 text-primary-hover ring-1 ring-inset ring-primary/25",
  success: "bg-success/12 text-success ring-1 ring-inset ring-success/25",
  danger: "bg-critical/10 text-critical ring-1 ring-inset ring-critical/25",
  warning: "bg-high/10 text-high ring-1 ring-inset ring-high/25",
  muted: "bg-surface-2 text-ink-subtle ring-1 ring-inset ring-hairline",
};

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  /** leading dot */
  dot?: boolean;
}

export function Badge({ children, tone = "neutral", className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-caption font-medium whitespace-nowrap",
        TONES[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/** Severity pill with consistent product palette. */
export function SeverityBadge({
  severity,
  className,
  showDot = true,
}: {
  severity: Severity;
  className?: string;
  showDot?: boolean;
}) {
  const s = SEVERITY[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-caption font-medium whitespace-nowrap",
        s.badge,
        className,
      )}
    >
      {showDot && <span className={cn("size-1.5 rounded-full", s.dot)} />}
      {s.label}
    </span>
  );
}
