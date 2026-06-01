import { KeySquare, KeyRound, FileKey } from "lucide-react";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useFilteredRows, type FacetDef } from "@/hooks/useFilteredRows";
import { relativeTime } from "@/lib/format";
import type { AccessKey } from "@/data/types";

const TABLE = "access-keys";

const KIND_META = {
  deploy: { label: "Deploy", icon: KeySquare, tone: "primary" as const },
  ssh: { label: "SSH", icon: KeyRound, tone: "neutral" as const },
  gpg: { label: "GPG", icon: FileKey, tone: "muted" as const },
};

export function KeysTab({ keys }: { keys: AccessKey[] }) {
  const facets: FacetDef<AccessKey>[] = [
    {
      key: "kind",
      label: "Kind",
      accessor: (r) => r.kind,
      options: [
        { value: "deploy", label: "Deploy keys" },
        { value: "ssh", label: "SSH keys" },
        { value: "gpg", label: "GPG keys" },
      ],
    },
    {
      key: "used",
      label: "Usage",
      accessor: (r) => (r.lastUsedAt ? "used" : "never"),
      options: [
        { value: "used", label: "Used" },
        { value: "never", label: "Never used" },
      ],
    },
  ];

  const rows = useFilteredRows(TABLE, keys, {
    search: (r) => `${r.title} ${r.fingerprint} ${r.repo ?? ""}`,
    facets,
  });

  const columns: Column<AccessKey>[] = [
    {
      id: "title",
      header: "Key",
      sortValue: (r) => r.title,
      cell: (r) => {
        const m = KIND_META[r.kind];
        return (
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-surface-3 text-ink-subtle">
              <m.icon className="size-3.5" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-ink">{r.title}</p>
              <p className="truncate font-mono text-caption text-ink-tertiary">
                {r.fingerprint.slice(0, 28)}…
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "kind",
      header: "Type",
      sortValue: (r) => r.kind,
      cell: (r) => (
        <Badge tone={KIND_META[r.kind].tone}>
          {KIND_META[r.kind].label}
          {r.readOnly ? " · RO" : ""}
        </Badge>
      ),
    },
    {
      id: "repo",
      header: "Scope",
      hideBelow: "md",
      cell: (r) => (
        <span className="font-mono text-caption text-ink-muted">{r.repo ?? "account"}</span>
      ),
    },
    {
      id: "addedAt",
      header: "Added",
      sortValue: (r) => r.addedAt,
      align: "right",
      hideBelow: "lg",
      cell: (r) => <span className="text-caption text-ink-subtle">{relativeTime(r.addedAt)}</span>,
    },
    {
      id: "lastUsedAt",
      header: "Last used",
      sortValue: (r) => r.lastUsedAt ?? "",
      align: "right",
      cell: (r) =>
        r.lastUsedAt ? (
          <span className="text-caption text-ink-subtle">{relativeTime(r.lastUsedAt)}</span>
        ) : (
          <span className="text-caption text-high">never</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <FilterBar
        tableKey={TABLE}
        facets={facets}
        searchPlaceholder="Search keys…"
        count={rows.length}
        total={keys.length}
        noun="keys"
      />
      <DataTable
        tableKey={TABLE}
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        empty={{ icon: KeySquare, title: "No keys", description: "No deploy, SSH or GPG keys." }}
      />
    </div>
  );
}
