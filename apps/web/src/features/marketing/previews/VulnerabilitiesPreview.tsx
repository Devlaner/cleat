import { ShieldAlert, Flame, GitPullRequestArrow, Crosshair } from "lucide-react";
import { SummaryStats } from "@/components/ui/SummaryStats";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { MonoChip } from "@/components/ui/Chip";
import { ScoreBar } from "@/components/ui/Meters";
import { vulnPriority } from "@/data/metrics";
import { ecosystem } from "@/lib/ecosystems";
import { SEVERITY, cvssToSeverity } from "@/lib/severity";
import { percent } from "@/lib/format";
import { cn } from "@/lib/cn";
import { PreviewHeader, PreviewFilterBar } from "./previewChrome";
import type { Dataset, Vulnerability } from "@contracts/types";

export function VulnerabilitiesPreview({ ds }: { ds: Dataset }) {
  const rows = [...ds.vulnerabilities]
    .sort((a, b) => vulnPriority(b) - vulnPriority(a))
    .slice(0, 9);
  const critical = ds.vulnerabilities.filter((v) => v.severity === "critical").length;
  const kev = ds.vulnerabilities.filter((v) => v.kev).length;
  const fixable = ds.vulnerabilities.filter((v) => v.fixedVersion).length;

  const columns: Column<Vulnerability>[] = [
    {
      id: "priority",
      header: "Priority",
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
      cell: (r) => (
        <span className={cn("font-semibold tabular-nums", SEVERITY[cvssToSeverity(r.cvss)].text)}>
          {r.cvss.toFixed(1)}
        </span>
      ),
    },
    {
      id: "epss",
      header: "EPSS",
      className: "w-28",
      cell: (r) => (
        <div className="flex items-center gap-2">
          <ScoreBar value={r.epss} hex="#ff9352" height={4} className="w-12" />
          <span className="tabular-nums text-ink-muted">{percent(r.epss, 1)}</span>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (r) =>
        r.kev ? (
          <Badge tone="danger">
            <Flame className="size-3" /> Exploited
          </Badge>
        ) : r.reachable === "reachable" ? (
          <span className="inline-flex items-center gap-1 text-caption text-high">
            <Crosshair className="size-3" /> Reachable
          </span>
        ) : (
          <span className="text-caption text-ink-tertiary">None</span>
        ),
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
    <div className="space-y-5 bg-canvas p-6">
      <PreviewHeader
        eyebrow="Security"
        title="Vulnerabilities"
        description="Vulnerable dependencies ranked by a fix-first priority blending severity, EPSS, KEV status and reachability."
      />
      <SummaryStats
        items={[
          {
            label: "Open advisories",
            value: ds.vulnerabilities.length,
            icon: <ShieldAlert className="size-3.5" />,
          },
          { label: "Critical", value: critical, tone: critical ? "text-critical" : undefined },
          {
            label: "Actively exploited",
            value: kev,
            tone: kev ? "text-critical" : undefined,
            icon: <Flame className="size-3.5" />,
          },
          {
            label: "With a fix available",
            value: fixable,
            tone: "text-success",
            icon: <GitPullRequestArrow className="size-3.5" />,
          },
        ]}
      />
      <PreviewFilterBar
        facets={["Severity", "Ecosystem", "Reachability", "Exploited (KEV)"]}
        count={rows.length}
        noun="advisories"
      />
      <DataTable tableKey="pv-vulns" columns={columns} rows={rows} getRowId={(r) => r.id} />
    </div>
  );
}
