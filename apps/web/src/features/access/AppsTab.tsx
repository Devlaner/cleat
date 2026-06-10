import { AppWindow, Puzzle } from "lucide-react";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge, SeverityBadge } from "@/components/ui/Badge";
import { ScopeChip } from "@/components/ui/Chip";
import { useFilteredRows, type FacetDef } from "@/hooks/useFilteredRows";
import { SEVERITY } from "@/lib/severity";
import { relativeTime } from "@/lib/format";
import type { InstalledApp } from "@cleat/contracts";

const TABLE = "access-apps";

const RISKY = (p: string) =>
  p.includes("admin") || p.includes("delete") || p === "repo" || p === "workflow";

export function AppsTab({ apps }: { apps: InstalledApp[] }) {
  const facets: FacetDef<InstalledApp>[] = [
    {
      key: "kind",
      label: "Kind",
      accessor: (r) => r.kind,
      options: [
        { value: "oauth", label: "OAuth app" },
        { value: "github-app", label: "GitHub App" },
      ],
    },
    {
      key: "risk",
      label: "Risk",
      accessor: (r) => r.risk,
      options: (["critical", "high", "medium", "low", "info"] as const).map((s) => ({
        value: s,
        label: SEVERITY[s].label,
      })),
    },
  ];

  const rows = useFilteredRows(TABLE, apps, {
    search: (r) => `${r.name} ${r.permissions.join(" ")} ${r.installedBy}`,
    facets,
  });

  const columns: Column<InstalledApp>[] = [
    {
      id: "name",
      header: "Application",
      sortValue: (r) => r.name,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-surface-3 text-ink-subtle">
            {r.kind === "github-app" ? (
              <Puzzle className="size-3.5" />
            ) : (
              <AppWindow className="size-3.5" />
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{r.name}</p>
            <p className="truncate text-caption text-ink-tertiary">
              {r.kind === "github-app" ? "GitHub App" : "OAuth app"} · by {r.installedBy}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "permissions",
      header: "Permissions",
      hideBelow: "md",
      cell: (r) => (
        <div className="flex max-w-xs flex-wrap gap-1">
          {r.permissions.map((p) => (
            <ScopeChip key={p} danger={RISKY(p)}>
              {p}
            </ScopeChip>
          ))}
        </div>
      ),
    },
    {
      id: "repoAccess",
      header: "Repos",
      sortValue: (r) => (r.repoAccess === "all" ? Infinity : r.repoAccess),
      hideBelow: "lg",
      align: "right",
      cell: (r) =>
        r.repoAccess === "all" ? (
          <Badge tone="warning">all repos</Badge>
        ) : (
          <span className="tabular-nums text-ink-muted">{r.repoAccess}</span>
        ),
    },
    {
      id: "risk",
      header: "Risk",
      sortValue: (r) => SEVERITY[r.risk].rank,
      cell: (r) => <SeverityBadge severity={r.risk} showDot={false} />,
    },
    {
      id: "lastUsedAt",
      header: "Last used",
      sortValue: (r) => r.lastUsedAt,
      align: "right",
      hideBelow: "sm",
      cell: (r) => (
        <span className="text-caption text-ink-subtle">{relativeTime(r.lastUsedAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <FilterBar
        tableKey={TABLE}
        facets={facets}
        searchPlaceholder="Search apps, scopes…"
        count={rows.length}
        total={apps.length}
        noun="apps"
      />
      <DataTable
        tableKey={TABLE}
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        empty={{
          icon: AppWindow,
          title: "No apps match",
          description: "Adjust the filters above.",
        }}
      />
    </div>
  );
}
