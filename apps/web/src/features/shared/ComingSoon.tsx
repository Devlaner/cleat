import type { LucideIcon } from "lucide-react";
import { Hammer } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

/** Temporary page scaffold used until a screen is built out in a later phase. */
export function ComingSoon({
  title,
  description,
  eyebrow,
  icon = Hammer,
  testId,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  icon?: LucideIcon;
  testId?: string;
}) {
  return (
    <div data-testid={testId ?? "coming-soon-page"} className="space-y-6">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <Card>
        <EmptyState
          icon={icon}
          title="Coming together"
          description="This screen is being built. Check back as Cleat fills in."
        />
      </Card>
    </div>
  );
}
