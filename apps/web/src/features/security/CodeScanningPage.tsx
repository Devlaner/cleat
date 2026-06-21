import { ScanLine, ShieldCheck, CircleDot, CircleCheck, CircleSlash } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SummaryStats } from "@/components/ui/SummaryStats";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SeverityBadge, Badge } from "@/components/ui/Badge";
import { useDataset } from "@/hooks/useDataset";
import { useFilteredRows, type FacetDef } from "@/hooks/useFilteredRows";
import { SEVERITY } from "@/lib/severity";
import { relativeTime } from "@/lib/format";
import type { CodeScanAlert } from "@cleat/contracts";

const TABLE = "code-scanning";

const STATUS_META: Record<
  CodeScanAlert["status"],
  { label: string; tone: "warning" | "success" | "muted"; icon: typeof CircleDot }
> = {
  open: { label: "Open", tone: "warning", icon: CircleDot },
  fixed: { label: "Fixed", tone: "success", icon: CircleCheck },
  dismissed: { label: "Dismissed", tone: "muted", icon: CircleSlash },
};

export function CodeScanningPage() {
  const { data: ds, error, loading, retry } = useDataset();

  const facets: FacetDef<CodeScanAlert>[] = [
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
      key: "status",
      label: "Status",
      accessor: (r) => r.status,
      options: [
        { value: "open", label: "Open" },
        { value: "fixed", label: "Fixed" },
        { value: "dismissed", label: "Dismissed" },
      ],
    },
    {
      key: "tool",
      label: "Tool",
      accessor: (r) => r.tool,
      options: [...new Set(ds?.codeAlerts?.map((a) => a.tool) ?? [])].map((t) => ({
        value: t,
        label: t,
      })),
    },
  ];

  const rows = useFilteredRows(TABLE, ds?.codeAlerts ?? [], {
    search: (r) => `${r.rule} ${r.ruleId} ${r.repo} ${r.file}`,
    facets,
  });

  if (loading) {
    return (
      <div data-testid="code-scanning-page" className="flex h-[60vh] items-center justify-center">
        <div
          className="size-8 animate-spin rounded-full border-2 border-surface-3 border-t-primary"
          aria-label="loading"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-testid="code-scanning-page"
        className="flex h-[60vh] flex-col items-center justify-center gap-3 text-sm text-ink-subtle"
      >
        <p> Failed to load code scanning data.</p>
        <button
          onClick={retry}
          className="rounded-md bg-surface-2 px-3 py-2 text-ink hover:bg-surface-3"
        >
          Retry
        </button>
      </div>
    );
  }
  if (!ds) {
    return (
      <div
        data-testid="code-scanning-page"
        className="flex h-[60vh] items-center justify-center text-sm text-ink-subtle"
      >
        No data available.
      </div>
    );
  }

  const open = ds.codeAlerts.filter((a) => a.status === "open").length;
  const fixed = ds.codeAlerts.filter((a) => a.status === "fixed").length;
  const dismissed = ds.codeAlerts.filter((a) => a.status === "dismissed").length;
  const rules = new Set(ds.codeAlerts.map((a) => a.ruleId)).size;

  const columns: Column<CodeScanAlert>[] = [
    {
      id: "rule",
      header: "Alert",
      sortValue: (r) => r.rule,
      cell: (r) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{r.rule}</p>
          <p className="truncate font-mono text-caption text-ink-tertiary">{r.ruleId}</p>
        </div>
      ),
    },
    {
      id: "severity",
      header: "Severity",
      sortValue: (r) => SEVERITY[r.severity].rank,
      cell: (r) => <SeverityBadge severity={r.severity} />,
    },
    {
      id: "repo",
      header: "Repository",
      sortValue: (r) => r.repo,
      hideBelow: "md",
      cell: (r) => <span className="font-mono text-[0.8125rem] text-ink-muted">{r.repo}</span>,
    },
    {
      id: "file",
      header: "Location",
      hideBelow: "lg",
      cell: (r) => (
        <span className="font-mono text-[0.8125rem] text-ink-subtle">
          {r.file}:{r.line}
        </span>
      ),
    },
    {
      id: "tool",
      header: "Tool",
      sortValue: (r) => r.tool,
      hideBelow: "lg",
      cell: (r) => <Badge tone="neutral">{r.tool}</Badge>,
    },
    {
      id: "status",
      header: "Status",
      sortValue: (r) => r.status,
      cell: (r) => {
        const m = STATUS_META[r.status];
        return (
          <Badge tone={m.tone} dot>
            {m.label}
          </Badge>
        );
      },
    },
    {
      id: "detectedAt",
      header: "Detected",
      sortValue: (r) => r.detectedAt,
      align: "right",
      hideBelow: "sm",
      cell: (r) => <span className="text-ink-subtle">{relativeTime(r.detectedAt)}</span>,
    },
  ];

  return (
    <div data-testid="code-scanning-page" className="space-y-5">
      <PageHeader
        eyebrow="Security"
        title="Code scanning"
        description="Static-analysis alerts from CodeQL and Semgrep, grouped by rule and severity across your repositories."
      />

      <SummaryStats
        items={[
          {
            label: "Open alerts",
            value: open,
            tone: open > 0 ? "text-high" : "text-success",
            icon: <CircleDot className="size-3.5" />,
          },
          {
            label: "Fixed",
            value: fixed,
            tone: "text-success",
            icon: <CircleCheck className="size-3.5" />,
          },
          { label: "Dismissed", value: dismissed, icon: <CircleSlash className="size-3.5" /> },
          { label: "Distinct rules", value: rules, icon: <ScanLine className="size-3.5" /> },
        ]}
      />

      <FilterBar
        tableKey={TABLE}
        facets={facets}
        searchPlaceholder="Search rules, repos, files…"
        count={rows.length}
        total={ds.codeAlerts.length}
        noun="alerts"
      />

      <DataTable
        tableKey={TABLE}
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        empty={{
          icon: ShieldCheck,
          title: "No code-scanning alerts",
          description: "Nothing matches the current filters.",
        }}
      />
    </div>
  );
}
