import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "danger" | "success" | "warning" | "neutral" | "info";

const TONES: Record<Tone, { text: string; dot: string }> = {
  danger: { text: "text-critical", dot: "bg-critical" },
  success: { text: "text-success", dot: "bg-success" },
  warning: { text: "text-high", dot: "bg-high" },
  info: { text: "text-low", dot: "bg-low" },
  neutral: { text: "text-ink-subtle", dot: "bg-ink-subtle" },
};

/** Borderless dot + label - for active/revoked, pinned/unpinned, on/off states. */
export function StatusPill({
  tone,
  children,
  pulse,
  className,
}: {
  tone: Tone;
  children: ReactNode;
  pulse?: boolean;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-caption font-medium", t.text, className)}>
      <span className={cn("size-1.5 rounded-full", t.dot, pulse && "animate-pulse-ring")} />
      {children}
    </span>
  );
}
