import { useMemo, useState } from "react";
import { Package, ShieldAlert, ArrowUpCircle, Scale, Download, FileJson } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SummaryStats } from "@/components/ui/SummaryStats";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, SeverityBadge } from "@/components/ui/Badge";
import { MonoChip } from "@/components/ui/Chip";
import { Segmented } from "@/components/ui/Tabs";
import { SegmentBar } from "@/components/ui/Meters";
import { Button } from "@/components/ui/Button";
import { useDataset } from "@/hooks/useDataset";
import { useFilteredRows, type FacetDef } from "@/hooks/useFilteredRows";
import {
  buildDependencies,
  licenseDistribution,
  COPYLEFT,
  type Dependency,
} from "./buildDependencies";
import { buildSpdx, buildCycloneDx } from "./sbom";
import { downloadFile } from "@/lib/download";
import { ecosystem } from "@/lib/ecosystems";
import { pluralize } from "@/lib/format";
import { useUiStore } from "@/stores/useUiStore";
import { cn } from "@/lib/cn";

const TABLE = "dependencies";

export function DependenciesPage() {
  const { data: ds, error, loading, retry } = useDataset();
  const addToast = useUiStore((s) => s.addToast);
  const [format, setFormat] = useState("spdx");
  const deps = useMemo(() => (ds ? buildDependencies(ds) : []), [ds]);
  const dist = useMemo(() => (deps.length ? licenseDistribution(deps) : []), [deps]);

  const facets: FacetDef<Dependency>[] = [
    {
      key: "ecosystem",
      label: "Ecosystem",
      accessor: (r) => r.ecosystem,
      options: [...new Set(deps.map((d) => d.ecosystem))].map((e) => ({
        value: e,
        label: ecosystem(e).label,
      })),
    },
    {
      key: "status",
      label: "Status",
      accessor: (r) =>
        [r.vulnerable ? "vulnerable" : "", r.outdated ? "outdated" : ""].filter(Boolean),
      options: [
        { value: "vulnerable", label: "Vulnerable" },
        { value: "outdated", label: "Outdated" },
      ],
    },
    {
      key: "license",
      label: "License",
      accessor: (r) => r.license,
      options: dist.map((d) => ({ value: d.license, label: d.license })),
    },
  ];

  const rows = useFilteredRows(TABLE, deps, {
    search: (r) => `${r.name} ${r.ecosystem} ${r.license}`,
    facets,
  });

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div
          className="size-8 animate-spin rounded-full border-2 border-surface-3 border-t-primary"
          aria-label="loading"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-sm text-ink-subtle">
        <p> Failed to load dependencies.</p>
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
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-sm text-ink-subtle">
        <Package className="size-6" />
        <span>No dependency data found.</span>
      </div>
    );
  }
  const vulnerable = deps.filter((d) => d.vulnerable).length;
  const outdated = deps.filter((d) => d.outdated).length;
  const copyleft = deps.filter((d) => COPYLEFT.has(d.license)).length;

  function exportSbom() {
    if (!ds) return;

    const content =
      format === "spdx"
        ? buildSpdx(ds.account.login, deps)
        : buildCycloneDx(ds.account.login, deps);

    downloadFile(`${ds.account.login}-sbom.${format}.json`, content);

    addToast({
      title: `${format === "spdx" ? "SPDX" : "CycloneDX"} SBOM exported`,
      description: `${deps.length} components`,
      variant: "success",
    });
  }
  const columns: Column<Dependency>[] = [
    {
      id: "name",
      header: "Package",
      sortValue: (r) => r.name,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <MonoChip short={ecosystem(r.ecosystem).short} hex={ecosystem(r.ecosystem).hex} />
          <span className="font-mono text-[0.8125rem] text-ink">{r.name}</span>
          {r.direct && <Badge tone="muted">direct</Badge>}
        </div>
      ),
    },
    {
      id: "version",
      header: "Version",
      hideBelow: "sm",
      cell: (r) => (
        <span className="font-mono text-caption">
          <span className={r.outdated ? "text-high" : "text-ink-muted"}>{r.version}</span>
          {r.outdated && <span className="text-ink-tertiary"> → {r.latestVersion}</span>}
        </span>
      ),
    },
    {
      id: "license",
      header: "License",
      sortValue: (r) => r.license,
      hideBelow: "md",
      cell: (r) => (
        <Badge tone={COPYLEFT.has(r.license) ? "warning" : "neutral"}>{r.license}</Badge>
      ),
    },
    {
      id: "usedByRepos",
      header: "Used by",
      sortValue: (r) => r.usedByRepos,
      align: "right",
      hideBelow: "lg",
      cell: (r) => (
        <span className="tabular-nums text-ink-muted">{pluralize(r.usedByRepos, "repo")}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      align: "right",
      sortValue: (r) => (r.vulnerable ? 2 : r.outdated ? 1 : 0),
      cell: (r) =>
        r.vulnerable && r.vulnSeverity ? (
          <SeverityBadge severity={r.vulnSeverity} showDot={false} />
        ) : r.outdated ? (
          <span className="inline-flex items-center gap-1 text-caption text-high">
            <ArrowUpCircle className="size-3" /> outdated
          </span>
        ) : (
          <span className="text-caption text-success">up to date</span>
        ),
    },
  ];

  return (
    <div data-testid="dependencies-page" className="space-y-5">
      <PageHeader
        eyebrow="Supply chain"
        title="Dependencies & SBOM"
        description="Your full dependency inventory with license compliance and exportable software bill of materials."
      />

      <SummaryStats
        items={[
          {
            label: "Total dependencies",
            value: deps.length,
            icon: <Package className="size-3.5" />,
          },
          {
            label: "Vulnerable",
            value: vulnerable,
            tone: vulnerable > 0 ? "text-critical" : "text-success",
            icon: <ShieldAlert className="size-3.5" />,
          },
          {
            label: "Outdated",
            value: outdated,
            tone: outdated > 0 ? "text-high" : undefined,
            icon: <ArrowUpCircle className="size-3.5" />,
          },
          {
            label: "Copyleft licenses",
            value: copyleft,
            tone: copyleft > 0 ? "text-high" : undefined,
            icon: <Scale className="size-3.5" />,
          },
        ]}
      />

      {/* License compliance + SBOM export */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="License compliance"
            description="Distribution across all dependencies"
          />
          <div className="space-y-3 p-4 pt-0">
            <SegmentBar
              segments={dist.map((d) => ({ value: d.count, hex: d.hex, label: d.license }))}
              height={10}
            />
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3">
              {dist.map((d) => (
                <div key={d.license} className="flex items-center gap-2 text-caption">
                  <span className="size-2 rounded-full" style={{ backgroundColor: d.hex }} />
                  <span className={cn("text-ink-muted", d.copyleft && "text-high")}>
                    {d.license}
                  </span>
                  <span className="ml-auto tabular-nums text-ink-subtle">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Export SBOM"
            description="Software bill of materials"
            icon={<FileJson className="size-4" />}
          />
          <div className="space-y-3 p-4 pt-0">
            <Segmented
              className="w-full"
              options={[
                { id: "spdx", label: "SPDX" },
                { id: "cyclonedx", label: "CycloneDX" },
              ]}
              value={format}
              onChange={setFormat}
            />
            <p className="text-caption text-ink-subtle">
              {format === "spdx"
                ? "SPDX 2.3: broad tooling and compliance support."
                : "CycloneDX 1.5: security and VEX oriented."}
            </p>
            <Button variant="primary" className="w-full" onClick={exportSbom}>
              <Download className="size-4" /> Download {deps.length} components
            </Button>
          </div>
        </Card>
      </div>

      <FilterBar
        tableKey={TABLE}
        facets={facets}
        searchPlaceholder="Search dependencies…"
        count={rows.length}
        total={deps.length}
        noun="dependencies"
      />

      <DataTable
        tableKey={TABLE}
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        empty={{
          icon: Package,
          title: "No dependencies match",
          description: "Adjust the filters above.",
        }}
      />
    </div>
  );
}
