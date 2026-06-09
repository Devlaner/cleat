import { useState } from "react";
import { KeyRound, ShieldCheck, Ban, ShieldHalf } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SummaryStats } from "@/components/ui/SummaryStats";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SeverityBadge } from "@/components/ui/Badge";
import { StatusPill } from "@/components/ui/StatusPill";
import { MonoChip } from "@/components/ui/Chip";
import { SecretDetail } from "./SecretDetail";
import { useDataset } from "@/hooks/useDataset";
import { useFilteredRows, type FacetDef } from "@/hooks/useFilteredRows";
import { provider } from "@/lib/ecosystems";
import { SEVERITY } from "@/lib/severity";
import { relativeTime } from "@/lib/format";
import type { SecretFinding } from "@contracts/types";

const TABLE = "secrets";

export function SecretsPage() {
  const ds = useDataset();
  const [selected, setSelected] = useState<SecretFinding | null>(null);

  const active = ds.secrets.filter((s) => s.validity === "active").length;
  const revoked = ds.secrets.filter((s) => s.validity === "revoked").length;
  const blocked = ds.secrets.filter((s) => s.pushProtectionBlocked).length;
  const repos = new Set(ds.secrets.map((s) => s.repo)).size;

  const facets: FacetDef<SecretFinding>[] = [
    {
      key: "validity",
      label: "Validity",
      accessor: (r) => r.validity,
      options: [
        { value: "active", label: "Active" },
        { value: "revoked", label: "Revoked" },
        { value: "unknown", label: "Unknown" },
      ],
    },
    {
      key: "severity",
      label: "Severity",
      accessor: (r) => r.severity,
      options: (["critical", "high", "medium", "low"] as const).map((s) => ({
        value: s,
        label: SEVERITY[s].label,
      })),
    },
    {
      key: "provider",
      label: "Provider",
      accessor: (r) => r.provider,
      options: [...new Set(ds.secrets.map((s) => s.provider))].map((p) => ({
        value: p,
        label: provider(p).label,
      })),
    },
  ];

  const rows = useFilteredRows(TABLE, ds.secrets, {
    search: (r) => `${r.secretType} ${r.repo} ${r.file} ${r.author} ${provider(r.provider).label}`,
    facets,
  });

  const columns: Column<SecretFinding>[] = [
    {
      id: "secretType",
      header: "Secret",
      sortValue: (r) => r.secretType,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <MonoChip short={provider(r.provider).short} hex={provider(r.provider).hex} />
          <span className="font-medium text-ink">{r.secretType}</span>
        </div>
      ),
    },
    {
      id: "repo",
      header: "Repository",
      sortValue: (r) => r.repo,
      cell: (r) => <span className="font-mono text-[0.8125rem] text-ink-muted">{r.repo}</span>,
      hideBelow: "md",
    },
    {
      id: "file",
      header: "Location",
      cell: (r) => (
        <span className="font-mono text-[0.8125rem] text-ink-subtle">
          {r.file}:{r.line}
        </span>
      ),
      hideBelow: "lg",
    },
    {
      id: "validity",
      header: "Validity",
      sortValue: (r) => r.validity,
      cell: (r) => (
        <StatusPill
          tone={
            r.validity === "active" ? "danger" : r.validity === "revoked" ? "neutral" : "warning"
          }
          pulse={r.validity === "active"}
        >
          {r.validity === "active" ? "Active" : r.validity === "revoked" ? "Revoked" : "Unknown"}
        </StatusPill>
      ),
    },
    {
      id: "severity",
      header: "Severity",
      sortValue: (r) => SEVERITY[r.severity].rank,
      align: "left",
      cell: (r) => <SeverityBadge severity={r.severity} />,
    },
    {
      id: "detectedAt",
      header: "Detected",
      sortValue: (r) => r.detectedAt,
      cell: (r) => <span className="text-ink-subtle">{relativeTime(r.detectedAt)}</span>,
      hideBelow: "sm",
      align: "right",
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Security"
        title="Secrets"
        description="Leaked credentials across your repositories. Active keys are exploitable right now, so revoke them first."
      />

      <SummaryStats
        items={[
          {
            label: "Active secrets",
            value: active,
            tone: active > 0 ? "text-critical" : "text-success",
            icon: <Ban className="size-3.5" />,
          },
          { label: "Revoked", value: revoked, icon: <ShieldCheck className="size-3.5" /> },
          {
            label: "Push protection blocks",
            value: blocked,
            icon: <ShieldHalf className="size-3.5" />,
          },
          { label: "Repositories affected", value: repos, icon: <KeyRound className="size-3.5" /> },
        ]}
      />

      <FilterBar
        tableKey={TABLE}
        facets={facets}
        searchPlaceholder="Search secrets, repos, files…"
        count={rows.length}
        total={ds.secrets.length}
        noun="secrets"
      />

      <DataTable
        tableKey={TABLE}
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        onRowClick={setSelected}
        empty={{
          icon: ShieldCheck,
          title: "No secrets match",
          description: "Try clearing filters, or enjoy a clean slate.",
        }}
      />

      <SecretDetail secret={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
