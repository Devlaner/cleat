import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  tone = "neutral",
}: {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  tone?: "neutral" | "success";
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-xl ring-1 ring-inset",
          tone === "success"
            ? "bg-success/10 text-success ring-success/20"
            : "bg-surface-2 text-ink-subtle ring-hairline",
        )}
      >
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-body-sm font-medium text-ink">{title}</p>
        {description && (
          <p className="mx-auto mt-1 max-w-sm text-caption text-ink-subtle">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
