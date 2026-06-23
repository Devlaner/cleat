import { KeyRound, AlertTriangle } from "lucide-react";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { ScopeChip } from "@/components/ui/Chip";
import { useFilteredRows, type FacetDef } from "@/hooks/useFilteredRows";
import { relativeTime, daysUntil } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Pat } from "@cleat/contracts";

const TABLE = "access-tokens";

const RISKY = (s: string) =>
  s.includes("admin") || s.includes("delete") || s === "repo" || s === "workflow";

function expiryStatus(pat: Pat): "expired" | "soon" | "future" | "none" {
  if (!pat.expiresAt) return "none";
  const d = daysUntil(pat.expiresAt);
  if (d <= 0) return "expired";
  if (d <= 14) return "soon";
  return "future";
}

export function TokensTab({ pats }: { pats: Pat[] }) {
  const classic = pats.filter((p) => p.kind === "classic").length;
  const expiring = pats.filter((p) => ["expired", "soon"].includes(expiryStatus(p))).length;

  const facets: FacetDef<Pat>[] = [
    {
      key: "kind",
      label: "Type",
      accessor: (r) => r.kind,
      options: [
        { value: "classic", label: "Classic" },
        { value: "fine-grained", label: "Fine-grained" },
      ],
    },
    {
      key: "expiry",
      label: "Expiry",
      accessor: (r) => expiryStatus(r),
      options: [
        { value: "expired", label: "Expired" },
        { value: "soon", label: "Expiring soon" },
        { value: "none", label: "No expiry" },
      ],
    },
  ];

  const rows = useFilteredRows(TABLE, pats, {
    search: (r) => `${r.name} ${r.scopes.join(" ")}`,
    facets,
  });

  const columns: Column<Pat>[] = [
    {
      id: "name",
      header: "Token",
      sortValue: (r) => r.name,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <KeyRound className="size-4 shrink-0 text-ink-tertiary" />
          <span className="font-mono text-[0.8125rem] text-ink">{r.name}</span>
        </div>
      ),
    },
    {
      id: "kind",
      header: "Type",
      sortValue: (r) => r.kind,
      cell: (r) =>
        r.kind === "classic" ? (
          <Badge tone="danger">classic</Badge>
        ) : (
          <Badge tone="success">fine-grained</Badge>
        ),
    },
    {
      id: "scopes",
      header: "Scopes",
      hideBelow: "md",
      cell: (r) => (
        <div className="flex max-w-xs flex-wrap gap-1">
          {r.scopes.map((s) => (
            <ScopeChip key={s} danger={RISKY(s)}>
              {s}
            </ScopeChip>
          ))}
        </div>
      ),
    },
    {
      id: "lastUsedAt",
      header: "Last used",
      sortValue: (r) => r.lastUsedAt ?? "",
      hideBelow: "lg",
      align: "right",
      cell: (r) =>
        r.lastUsedAt ? (
          <span className="text-caption text-ink-subtle">{relativeTime(r.lastUsedAt)}</span>
        ) : (
          <span className="text-caption text-ink-tertiary">never</span>
        ),
    },
    {
      id: "expiresAt",
      header: "Expires",
      sortValue: (r) => r.expiresAt ?? "9999",
      align: "right",
      cell: (r) => {
        const st = expiryStatus(r);
        if (st === "none") return <span className="text-caption text-high">never</span>;
        const d = daysUntil(r.expiresAt!);
        return (
          <span
            className={cn(
              "text-caption",
              st === "expired" ? "text-critical" : st === "soon" ? "text-high" : "text-ink-subtle",
            )}
          >
            {st === "expired" ? "expired" : `in ${d}d`}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {classic > 0 && (
        <div className="flex items-start gap-2.5 rounded-lg border border-high/25 bg-high/[0.06] p-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-high" />
          <p className="text-caption text-ink-muted">
            <span className="font-medium text-ink">
              {classic} classic token{classic > 1 ? "s" : ""}
            </span>{" "}
            grant access to every repo you can see. Migrate to fine-grained tokens to shrink the
            blast radius.
          </p>
        </div>
      )}
      <FilterBar
        tableKey={TABLE}
        facets={facets}
        searchPlaceholder="Search tokens…"
        count={rows.length}
        total={pats.length}
        noun="tokens"
      />
      <DataTable
        tableKey={TABLE}
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        empty={{ icon: KeyRound, title: "No tokens", description: "No personal access tokens." }}
      />
      <p className="text-caption text-ink-subtle">
        {classic} classic · {pats.length - classic} fine-grained · {expiring} expired or expiring
        soon.
      </p>
    </div>
  );
}
