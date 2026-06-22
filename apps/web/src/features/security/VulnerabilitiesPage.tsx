import { useState, useMemo } from "react";
import { ShieldAlert, Flame, GitPullRequestArrow, ShieldCheck, Crosshair } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SummaryStats } from "@/components/ui/SummaryStats";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { MonoChip } from "@/components/ui/Chip";
import { ScoreBar } from "@/components/ui/Meters";
import { VulnDetail } from "./VulnDetail";
import { useDataset } from "@/hooks/useDataset";
import { useFilteredRows, type FacetDef } from "@/hooks/useFilteredRows";
import { vulnPriority } from "@/data/metrics";
import { ecosystem } from "@/lib/ecosystems";
import { SEVERITY, cvssToSeverity } from "@/lib/severity";
import { percent, pluralize } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Vulnerability } from "@cleat/contracts";

const TABLE = "vulnerabilities";

export function VulnerabilitiesPage() {
  const { data: ds, error, loading, retry } = useDataset();

  const [selected, setSelected] = useState<Vulnerability | null>(null);
  const facets: FacetDef<Vulnerability>[] = [
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
      key: "ecosystem",
      label: "Ecosystem",
      accessor: (r) => r.ecosystem,
      options: [...new Set(ds?.vulnerabilities?.map((v) => v.ecosystem) ?? [])].map((e) => ({
        value: e,
        label: ecosystem(e).label,
      })),
    },
    {
      key: "reachable",
      label: "Reachability",
      accessor: (r) => r.reachable,
      options: [
        { value: "reachable", label: "Reachable" },
        { value: "not-reachable", label: "Not reachable" },
        { value: "unknown", label: "Unknown" },
      ],
    },
    {
      key: "kev",
      label: "Exploited (KEV)",
      accessor: (r) => (r.kev ? "yes" : "no"),
      options: [
        { value: "yes", label: "In KEV catalog" },
        { value: "no", label: "Not in KEV" },
      ],
    },
  ];
  const filtered = useFilteredRows(TABLE, ds?.vulnerabilities ?? [], {
    search: (r) => `${r.package} ${r.title} ${r.advisoryId} ${r.cwe}`,
    facets,
  });
  // default ranking: highest priority first (DataTable preserves order until a header is clicked)
  const rows = useMemo(
    () => [...filtered].sort((a, b) => vulnPriority(b) - vulnPriority(a)),
    [filtered],
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div
          role="status"
          aria-label="Loading vulnerability data"
          className="size-8 animate-spin rounded-full border-2 border-surface-3 border-t-primary"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-sm text-ink-subtle">
        <p> Failed to load vulnerability data.</p>
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
      <div className="flex h-[60vh] items-center justify-center text-sm text-ink-subtle">
        No vulnerability data available.
      </div>
    );
  }
  const critical = ds.vulnerabilities.filter((v) => v.severity === "critical").length;
  const kev = ds.vulnerabilities.filter((v) => v.kev).length;
  const fixable = ds.vulnerabilities.filter((v) => v.fixedVersion).length;

  const columns: Column<Vulnerability>[] = [
    {
      id: "priority",
      header: "Priority",
      sortValue: (r) => vulnPriority(r),
      className: "w-16",
      cell: (r) => {
        const p = vulnPriority(r);
        const sev = p >= 75 ? "critical" : p >= 55 ? "high" : p >= 35 ? "medium" : "low";
        return (
          <span
            className={cn(
              "inline-flex min-w-7 justify-center rounded-md px-1.5 py-0.5 text-caption font-semibold tabular-nums",
              SEVERITY[sev].badge,
            )}
          >
            {p}
          </span>
        );
      },
    },
    {
      id: "package",
      header: "Advisory",
      sortValue: (r) => r.package,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <MonoChip short={ecosystem(r.ecosystem).short} hex={ecosystem(r.ecosystem).hex} />
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{r.title}</p>
            <p className="truncate font-mono text-caption text-ink-tertiary">
              {r.package} {r.currentVersion}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "cvss",
      header: "CVSS",
      sortValue: (r) => r.cvss,
      align: "left",
      cell: (r) => (
        <span className={cn("font-semibold tabular-nums", SEVERITY[cvssToSeverity(r.cvss)].text)}>
          {r.cvss.toFixed(1)}
        </span>
      ),
    },
    {
      id: "epss",
      header: "EPSS",
      sortValue: (r) => r.epss,
      hideBelow: "md",
      className: "w-28",
      cell: (r) => (
        <div className="flex items-center gap-2">
          <ScoreBar value={r.epss} hex="#ff9352" height={4} className="w-12" />
          <span className="tabular-nums text-ink-muted">{percent(r.epss, 1)}</span>
        </div>
      ),
    },
    {
      id: "kev",
      header: "Status",
      sortValue: (r) => (r.kev ? 1 : 0),
      hideBelow: "lg",
      cell: (r) =>
        r.kev ? (
          <Badge tone="danger">
            <Flame aria-hidden="true" className="size-3" /> Exploited
          </Badge>
        ) : r.reachable === "reachable" ? (
          <span className="inline-flex items-center gap-1 text-caption text-high">
            <Crosshair aria-hidden="true" className="size-3" /> Reachable
          </span>
        ) : (
          <span className="text-caption text-ink-tertiary">None</span>
        ),
    },
    {
      id: "repos",
      header: "Repos",
      sortValue: (r) => r.affectedRepos.length,
      align: "right",
      hideBelow: "sm",
      cell: (r) => <span className="tabular-nums text-ink-muted">{r.affectedRepos.length}</span>,
    },
    {
      id: "fix",
      header: "Fix",
      align: "right",
      cell: (r) =>
        r.hasFixPr ? (
          <span className="inline-flex items-center gap-1 text-caption text-primary-hover">
            <GitPullRequestArrow className="size-3" /> PR ready
          </span>
        ) : r.fixedVersion ? (
          <span className="font-mono text-caption text-ink-muted">{r.fixedVersion}</span>
        ) : (
          <span className="text-caption text-ink-tertiary">none</span>
        ),
    },
  ];

  return (
    <div data-testid="vulnerabilities-page" className="space-y-5">
      <PageHeader
        eyebrow="Security"
        title="Vulnerabilities"
        description="Vulnerable dependencies ranked by a fix-first priority that blends severity, EPSS exploit probability, KEV status and reachability."
      />

      <SummaryStats
        items={[
          {
            label: "Open advisories",
            value: ds.vulnerabilities.length,
            icon: <ShieldAlert aria-hidden="true" className="size-3.5" />,
          },
          { label: "Critical", value: critical, tone: critical > 0 ? "text-critical" : undefined },
          {
            label: "Actively exploited",
            value: kev,
            tone: kev > 0 ? "text-critical" : undefined,
            icon: <Flame aria-hidden="true" className="size-3.5" />,
          },
          {
            label: "With a fix available",
            value: fixable,
            tone: "text-success",
            icon: <GitPullRequestArrow aria-hidden="true" className="size-3.5" />,
          },
        ]}
      />

      <FilterBar
        tableKey={TABLE}
        facets={facets}
        searchPlaceholder="Search packages, advisories, CWEs…"
        count={rows.length}
        total={ds.vulnerabilities.length}
        noun="advisories"
      />

      <DataTable
        tableKey={TABLE}
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        onRowClick={setSelected}
        empty={{
          icon: ShieldCheck,
          title: "No vulnerabilities match",
          description: "Adjust filters to see more.",
        }}
      />

      <p className="text-caption text-ink-subtle">
        Showing {pluralize(rows.length, "advisory", "advisories")} ranked by fix-first priority.
      </p>

      <VulnDetail vuln={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
