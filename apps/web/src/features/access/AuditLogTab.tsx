import { ScrollText } from "lucide-react";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge, SeverityBadge } from "@/components/ui/Badge";
import { useFilteredRows, type FacetDef } from "@/hooks/useFilteredRows";
import { SEVERITY } from "@/lib/severity";
import { relativeTime } from "@/lib/format";
import { eventIcon, CATEGORY_LABEL } from "@/features/notifications/eventMeta";
import { cn } from "@/lib/cn";
import type { ActivityEvent, EventCategory } from "@/data/types";

const TABLE = "access-audit";

export function AuditLogTab({ events }: { events: ActivityEvent[] }) {
  const facets: FacetDef<ActivityEvent>[] = [
    { key: "category", label: "Category", accessor: (r) => r.category, options: (Object.keys(CATEGORY_LABEL) as EventCategory[]).map((c) => ({ value: c, label: CATEGORY_LABEL[c] })) },
    { key: "severity", label: "Severity", accessor: (r) => r.severity, options: (["critical", "high", "medium", "low", "info"] as const).map((s) => ({ value: s, label: SEVERITY[s].label })) },
  ];

  const rows = useFilteredRows(TABLE, events, { search: (r) => `${r.message} ${r.actor} ${r.type} ${r.target}`, facets });

  const columns: Column<ActivityEvent>[] = [
    {
      id: "message",
      header: "Event",
      cell: (r) => {
        const Icon = eventIcon(r.type);
        return (
          <div className="flex items-center gap-2.5">
            <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg", SEVERITY[r.severity].badge)}><Icon className="size-3.5" /></span>
            <div className="min-w-0">
              <p className="truncate text-ink">{r.message}</p>
              <p className="truncate font-mono text-caption text-ink-tertiary">{r.type}</p>
            </div>
          </div>
        );
      },
    },
    { id: "actor", header: "Actor", sortValue: (r) => r.actor, hideBelow: "md", cell: (r) => <span className="text-ink-muted">{r.actor}</span> },
    { id: "category", header: "Category", sortValue: (r) => r.category, hideBelow: "lg", cell: (r) => <Badge tone="muted">{CATEGORY_LABEL[r.category]}</Badge> },
    { id: "severity", header: "Severity", sortValue: (r) => SEVERITY[r.severity].rank, cell: (r) => <SeverityBadge severity={r.severity} showDot={false} /> },
    { id: "createdAt", header: "When", sortValue: (r) => r.createdAt, align: "right", hideBelow: "sm", cell: (r) => <span className="text-caption text-ink-subtle">{relativeTime(r.createdAt)}</span> },
  ];

  return (
    <div className="space-y-4">
      <FilterBar tableKey={TABLE} facets={facets} searchPlaceholder="Search audit log…" count={rows.length} total={events.length} noun="events" />
      <DataTable tableKey={TABLE} columns={columns} rows={rows} getRowId={(r) => r.id} empty={{ icon: ScrollText, title: "No audit events", description: "Nothing matches the current filters." }} />
    </div>
  );
}
