import { Archive, HardDrive, PiggyBank, Timer, Database } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SummaryStats } from "@/components/ui/SummaryStats";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ProgressRing, SegmentBar } from "@/components/ui/Meters";
import { CostAreaChart } from "@/components/charts/CostAreaChart";
import { fromMb, currency, number, daysUntil, percent } from "@/lib/format";
import { cn } from "@/lib/cn";
import { PreviewHeader } from "./previewChrome";
import type { Dataset, Artifact } from "@contracts/types";

export function ArtifactsPreview({ ds }: { ds: Dataset }) {
  const u = ds.usage;
  const totalStorage =
    ds.artifacts.reduce((s, a) => s + a.sizeMb, 0) + ds.caches.reduce((s, c) => s + c.sizeMb, 0);
  const rows = [...ds.artifacts].sort((a, b) => b.sizeMb - a.sizeMb).slice(0, 4);

  const columns: Column<Artifact>[] = [
    {
      id: "name",
      header: "Artifact",
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <Archive className="size-4 shrink-0 text-ink-tertiary" />
          <div className="min-w-0">
            <p className="truncate font-mono text-[0.8125rem] text-ink">{r.name}</p>
            <p className="truncate text-caption text-ink-tertiary">
              {r.repo} · run {r.workflowRun}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "size",
      header: "Size",
      align: "right",
      cell: (r) => <span className="tabular-nums text-ink-muted">{fromMb(r.sizeMb)}</span>,
    },
    {
      id: "downloads",
      header: "Downloads",
      align: "right",
      cell: (r) => (
        <span
          className={cn("tabular-nums", r.downloads === 0 ? "text-ink-tertiary" : "text-ink-muted")}
        >
          {r.downloads}
        </span>
      ),
    },
    {
      id: "expires",
      header: "Expires",
      align: "right",
      cell: (r) => {
        const d = daysUntil(r.expiresAt);
        return (
          <span className={cn("text-caption", d < 7 ? "text-high" : "text-ink-subtle")}>
            {d <= 0 ? "expired" : `in ${d}d`}
          </span>
        );
      },
    },
    {
      id: "tag",
      header: "",
      align: "right",
      cell: (r) => (r.downloads === 0 ? <Badge tone="success">reclaimable</Badge> : null),
    },
  ];

  return (
    <div className="space-y-5 bg-canvas p-6">
      <PreviewHeader
        eyebrow="Maintenance"
        title="Artifacts & cost"
        description="Reclaim storage spend from forgotten build artifacts, stale caches and untagged packages, then forecast your bill."
      />
      <SummaryStats
        items={[
          {
            label: "Storage in use",
            value: fromMb(totalStorage),
            icon: <HardDrive className="size-3.5" />,
          },
          {
            label: "Reclaimable now",
            value: currency(ds.account.reclaimable),
            tone: "text-success",
            icon: <PiggyBank className="size-3.5" />,
          },
          {
            label: "Monthly spend",
            value: currency(u.monthlyCost),
            icon: <Archive className="size-3.5" />,
          },
          {
            label: "Actions minutes",
            value: number(u.actionsMinutes),
            hint: `of ${number(u.minutesIncluded)} included`,
            icon: <Timer className="size-3.5" />,
          },
        ]}
      />
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader
            title="Spend over time"
            description="Estimated monthly GitHub usage cost"
            action={
              <Badge tone="success" dot>
                {currency(ds.account.reclaimable)} reclaimable
              </Badge>
            }
          />
          <div className="px-2 pb-2">
            <CostAreaChart data={u.series} height={150} />
          </div>
          <div className="border-t border-hairline p-4">
            <SegmentBar
              segments={u.breakdown.map((b) => ({ value: b.cost, hex: b.hex, label: b.label }))}
              height={8}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Quota usage" description="This billing cycle" />
          <div className="flex items-center justify-around p-4 pt-0">
            <Gauge label="Minutes" value={u.actionsMinutes / u.minutesIncluded} />
            <Gauge label="Storage" value={u.storageGb / u.storageIncludedGb} />
          </div>
        </Card>
      </div>
      <DataTable
        tableKey="pv-artifacts"
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        empty={{ icon: Database, title: "No artifacts" }}
      />
    </div>
  );
}

function Gauge({ label, value }: { label: string; value: number }) {
  const pct = Math.min(1, value);
  const hex = pct > 0.9 ? "#fb5b78" : pct > 0.7 ? "#ff9352" : "#5e6ad2";
  return (
    <ProgressRing value={pct} size={92} stroke={7} hex={hex}>
      <span className="text-body font-semibold tabular-nums text-ink">{percent(pct)}</span>
      <span className="text-caption text-ink-subtle">{label}</span>
    </ProgressRing>
  );
}
