import { Webhook as WebhookIcon } from "lucide-react";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { ScopeChip } from "@/components/ui/Chip";
import { StatusPill } from "@/components/ui/StatusPill";
import { useFilteredRows, type FacetDef } from "@/hooks/useFilteredRows";
import { relativeTime } from "@/lib/format";
import type { Webhook } from "@/data/types";

const TABLE = "access-webhooks";

export function WebhooksTab({ webhooks }: { webhooks: Webhook[] }) {
  const facets: FacetDef<Webhook>[] = [
    { key: "active", label: "State", accessor: (r) => (r.active ? "active" : "inactive"), options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] },
    { key: "health", label: "Health", accessor: (r) => (r.lastStatus >= 200 && r.lastStatus < 300 ? "ok" : "failing"), options: [{ value: "ok", label: "Delivering" }, { value: "failing", label: "Failing" }] },
  ];

  const rows = useFilteredRows(TABLE, webhooks, { search: (r) => `${r.url} ${r.scope} ${r.events.join(" ")}`, facets });

  const columns: Column<Webhook>[] = [
    {
      id: "url",
      header: "Endpoint",
      sortValue: (r) => r.url,
      cell: (r) => (
        <div className="min-w-0">
          <p className="truncate font-mono text-[0.8125rem] text-ink">{r.url}</p>
          <p className="truncate text-caption text-ink-tertiary">{r.scope}</p>
        </div>
      ),
    },
    {
      id: "events",
      header: "Events",
      hideBelow: "md",
      cell: (r) => <div className="flex flex-wrap gap-1">{r.events.map((e) => <ScopeChip key={e}>{e}</ScopeChip>)}</div>,
    },
    {
      id: "status",
      header: "Last delivery",
      sortValue: (r) => r.lastStatus,
      cell: (r) => {
        const ok = r.lastStatus >= 200 && r.lastStatus < 300;
        return <StatusPill tone={ok ? "success" : "danger"}>{r.lastStatus}</StatusPill>;
      },
    },
    { id: "active", header: "State", sortValue: (r) => (r.active ? 1 : 0), hideBelow: "sm", cell: (r) => r.active ? <Badge tone="success" dot>active</Badge> : <Badge tone="muted">inactive</Badge> },
    { id: "lastDelivery", header: "When", sortValue: (r) => r.lastDelivery, align: "right", hideBelow: "lg", cell: (r) => <span className="text-caption text-ink-subtle">{relativeTime(r.lastDelivery)}</span> },
  ];

  return (
    <div className="space-y-4">
      <FilterBar tableKey={TABLE} facets={facets} searchPlaceholder="Search webhooks…" count={rows.length} total={webhooks.length} noun="webhooks" />
      <DataTable tableKey={TABLE} columns={columns} rows={rows} getRowId={(r) => r.id} empty={{ icon: WebhookIcon, title: "No webhooks", description: "No webhooks configured." }} />
    </div>
  );
}
