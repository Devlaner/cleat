import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** lift onto surface-2 + stronger hairline */
  raised?: boolean;
  /** subtle hover lift (for clickable cards) */
  interactive?: boolean;
}

/** Base panel: surface-1 + hairline + rounded-lg, with the faint top-edge highlight. */
export function Card({ className, raised, interactive, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "panel-highlight rounded-lg border",
        raised ? "bg-surface-2 border-hairline-strong" : "bg-surface-1 border-hairline",
        interactive &&
          "cursor-pointer transition-colors hover:bg-surface-2 hover:border-hairline-strong",
        className,
      )}
      {...props}
    />
  );
}

interface CardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, description, icon, action, className }: CardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 p-4", className)}>
      <div className="flex min-w-0 items-start gap-2.5">
        {icon && <div className="mt-0.5 text-ink-subtle">{icon}</div>}
        <div className="min-w-0">
          <h2 className="text-body-sm font-medium text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-caption text-ink-subtle">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
