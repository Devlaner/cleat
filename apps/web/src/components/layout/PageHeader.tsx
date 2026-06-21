import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  "data-testid": dataTestId,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  "data-testid"?: string;
}) {
  return (
    <div
      data-testid={dataTestId}
      className={cn("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", className)}
    >
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-eyebrow uppercase text-ink-tertiary">{eyebrow}</p>}
        <h1 className="text-headline font-semibold text-ink">{title}</h1>
        {description && (
          <p className="mt-1 max-w-2xl text-body-sm text-ink-subtle">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
