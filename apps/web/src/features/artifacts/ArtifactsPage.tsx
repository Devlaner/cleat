import { useMemo, useState } from "react";
import { Archive, HardDrive, PiggyBank, Timer, Trash2, Database, Package, Boxes, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SummaryStats } from "@/components/ui/SummaryStats";
import { Card, CardHeader } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ProgressRing, SegmentBar } from "@/components/ui/Meters";
import { CostAreaChart } from "@/components/charts/CostAreaChart";
import { useDataset } from "@/hooks/useDataset";
import { fromMb, currency, number, relativeTime, daysUntil, percent } from "@/lib/format";
import { useUiStore } from "@/stores/useUiStore";
import { cn } from "@/lib/cn";
import type { Artifact, CacheEntry, PackageEntry } from "@/data/types";

type Tab = "artifacts" | "caches" | "packages";

function isReclaimable(a: Artifact) {
  return a.downloads === 0 || Date.now() - +new Date(a.createdAt) > 30 * 86_400_000;
}

export function ArtifactsPage() {
  const ds = useDataset();
  const addToast = useUiStore((s) => s.addToast);
  const [tab, setTab] = useState<Tab>("artifacts");
  const [deleted, setDeleted] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const artifacts = useMemo(() => ds.artifacts.filter((a) => !deleted.has(a.id)), [ds.artifacts, deleted]);
  const caches = useMemo(() => ds.caches.filter((c) => !deleted.has(c.id)), [ds.caches, deleted]);
  const packages = ds.packages;

  const totalStorageMb =
    artifacts.reduce((s, a) => s + a.sizeMb, 0) + caches.reduce((s, c) => s + c.sizeMb, 0) + packages.reduce((s, p) => s + p.sizeMb, 0);
  const u = ds.usage;

  function switchTab(t: string) {
    setTab(t as Tab);
    setSelected(new Set());
  }

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const currentRows: { id: string; sizeMb: number }[] = tab === "artifacts" ? artifacts : tab === "caches" ? caches : [];
  const allSelected = currentRows.length > 0 && currentRows.every((r) => selected.has(r.id));
  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(currentRows.map((r) => r.id)));
  }

  const selectedSize = currentRows.filter((r) => selected.has(r.id)).reduce((s, r) => s + r.sizeMb, 0);

  function deleteSelected() {
    const count = selected.size;
    setDeleted((d) => new Set([...d, ...selected]));
    addToast({ title: `Deleted ${count} ${tab === "caches" ? "cache" : "artifact"}${count > 1 ? "s" : ""}`, description: `${fromMb(selectedSize)} reclaimed`, variant: "success" });
    setSelected(new Set());
  }

  function selectReclaimable() {
    setSelected(new Set(artifacts.filter(isReclaimable).map((a) => a.id)));
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Maintenance"
        title="Artifacts & cost"
        description="Reclaim storage spend from forgotten build artifacts, stale caches and untagged packages, then forecast your bill."
      />

      <SummaryStats
        items={[
          { label: "Storage in use", value: fromMb(totalStorageMb), icon: <HardDrive className="size-3.5" /> },
          { label: "Reclaimable now", value: currency(ds.account.reclaimable), tone: "text-success", icon: <PiggyBank className="size-3.5" /> },
          { label: "Monthly spend", value: currency(u.monthlyCost), icon: <Archive className="size-3.5" /> },
          { label: "Actions minutes", value: number(u.actionsMinutes), hint: `of ${number(u.minutesIncluded)} included`, icon: <Timer className="size-3.5" /> },
        ]}
      />

      {/* cost overview */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Spend over time"
            description="Estimated monthly GitHub usage cost"
            action={<Badge tone="success" dot>{currency(ds.account.reclaimable)} reclaimable</Badge>}
          />
          <div className="px-2 pb-2"><CostAreaChart data={u.series} height={180} /></div>
          <div className="border-t border-hairline p-4">
            <SegmentBar segments={u.breakdown.map((b) => ({ value: b.cost, hex: b.hex, label: b.label }))} height={8} />
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-4">
              {u.breakdown.map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-caption">
                  <span className="size-2 rounded-full" style={{ backgroundColor: b.hex }} />
                  <span className="truncate text-ink-muted">{b.label}</span>
                  <span className="ml-auto tabular-nums text-ink">{currency(b.cost)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Quota usage" description="This billing cycle" />
          <div className="flex items-center justify-around gap-2 p-4 pt-0">
            <Gauge label="Minutes" value={u.actionsMinutes / u.minutesIncluded} caption={`${percent(u.actionsMinutes / u.minutesIncluded)} used`} />
            <Gauge label="Storage" value={u.storageGb / u.storageIncludedGb} caption={`${u.storageGb.toFixed(1)} / ${u.storageIncludedGb} GB`} />
          </div>
        </Card>
      </div>

      {/* resource tabs */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs
            value={tab}
            onChange={switchTab}
            tabs={[
              { id: "artifacts", label: "Artifacts", count: artifacts.length },
              { id: "caches", label: "Caches", count: caches.length },
              { id: "packages", label: "Packages", count: packages.length },
            ]}
          />
          <div className="flex items-center gap-2">
            {tab === "artifacts" && (
              <Button variant="ghost" size="sm" onClick={selectReclaimable}>
                <Wand2 className="size-3.5" /> Select reclaimable
              </Button>
            )}
            {(tab === "artifacts" || tab === "caches") && selected.size > 0 && (
              <Button variant="danger" size="sm" onClick={deleteSelected}>
                <Trash2 className="size-3.5" /> Delete {selected.size} · reclaim {fromMb(selectedSize)}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4">
          {tab === "artifacts" && (
            <ArtifactTable rows={artifacts} selected={selected} toggle={toggle} allSelected={allSelected} toggleAll={toggleAll} />
          )}
          {tab === "caches" && (
            <CacheTable rows={caches} selected={selected} toggle={toggle} allSelected={allSelected} toggleAll={toggleAll} />
          )}
          {tab === "packages" && <PackageTable rows={packages} />}
        </div>
      </div>
    </div>
  );
}

function Gauge({ label, value, caption }: { label: string; value: number; caption: string }) {
  const pct = Math.min(1, value);
  const hex = pct > 0.9 ? "#fb5b78" : pct > 0.7 ? "#ff9352" : "#5e6ad2";
  return (
    <ProgressRing value={pct} size={104} stroke={8} hex={hex}>
      <span className="text-card-title font-semibold tabular-nums text-ink">{percent(pct)}</span>
      <span className="mt-0.5 text-caption text-ink-subtle">{label}</span>
      <span className="text-[0.625rem] text-ink-tertiary">{caption}</span>
    </ProgressRing>
  );
}

function ArtifactTable({ rows, selected, toggle, allSelected, toggleAll }: { rows: Artifact[]; selected: Set<string>; toggle: (id: string) => void; allSelected: boolean; toggleAll: () => void }) {
  const columns: Column<Artifact>[] = [
    { id: "name", header: "Artifact", sortValue: (r) => r.name, cell: (r) => (
      <div className="flex items-center gap-2.5">
        <Archive className="size-4 shrink-0 text-ink-tertiary" />
        <div className="min-w-0">
          <p className="truncate font-mono text-[0.8125rem] text-ink">{r.name}</p>
          <p className="truncate text-caption text-ink-tertiary">{r.repo} · run {r.workflowRun}</p>
        </div>
      </div>
    ) },
    { id: "size", header: "Size", sortValue: (r) => r.sizeMb, align: "right", cell: (r) => <span className="tabular-nums text-ink-muted">{fromMb(r.sizeMb)}</span> },
    { id: "downloads", header: "Downloads", sortValue: (r) => r.downloads, align: "right", hideBelow: "sm", cell: (r) => <span className={cn("tabular-nums", r.downloads === 0 ? "text-ink-tertiary" : "text-ink-muted")}>{r.downloads}</span> },
    { id: "expires", header: "Expires", sortValue: (r) => r.expiresAt, align: "right", hideBelow: "md", cell: (r) => { const d = daysUntil(r.expiresAt); return <span className={cn("text-caption", d < 7 ? "text-high" : "text-ink-subtle")}>{d <= 0 ? "expired" : `in ${d}d`}</span>; } },
    { id: "status", header: "", align: "right", cell: (r) => isReclaimable(r) ? <Badge tone="success">reclaimable</Badge> : null },
  ];
  return (
    <DataTable
      tableKey="artifacts"
      columns={columns}
      rows={rows}
      getRowId={(r) => r.id}
      selectable={{ isSelected: (r) => selected.has(r.id), onToggle: (r) => toggle(r.id), allSelected, onToggleAll: toggleAll }}
      empty={{ icon: Database, title: "No artifacts", description: "Everything's been cleaned up." }}
    />
  );
}

function CacheTable({ rows, selected, toggle, allSelected, toggleAll }: { rows: CacheEntry[]; selected: Set<string>; toggle: (id: string) => void; allSelected: boolean; toggleAll: () => void }) {
  const columns: Column<CacheEntry>[] = [
    { id: "key", header: "Cache key", sortValue: (r) => r.key, cell: (r) => (
      <div className="flex items-center gap-2.5">
        <Database className="size-4 shrink-0 text-ink-tertiary" />
        <div className="min-w-0">
          <p className="truncate font-mono text-[0.8125rem] text-ink">{r.key}</p>
          <p className="truncate text-caption text-ink-tertiary">{r.repo} · {r.ref}</p>
        </div>
      </div>
    ) },
    { id: "size", header: "Size", sortValue: (r) => r.sizeMb, align: "right", cell: (r) => <span className="tabular-nums text-ink-muted">{fromMb(r.sizeMb)}</span> },
    { id: "lastUsed", header: "Last used", sortValue: (r) => r.lastUsedAt, align: "right", hideBelow: "sm", cell: (r) => <span className="text-caption text-ink-subtle">{relativeTime(r.lastUsedAt)}</span> },
  ];
  return (
    <DataTable
      tableKey="caches"
      columns={columns}
      rows={rows}
      getRowId={(r) => r.id}
      selectable={{ isSelected: (r) => selected.has(r.id), onToggle: (r) => toggle(r.id), allSelected, onToggleAll: toggleAll }}
      empty={{ icon: Database, title: "No caches", description: "No Actions caches to show." }}
    />
  );
}

function PackageTable({ rows }: { rows: PackageEntry[] }) {
  const addToast = useUiStore((s) => s.addToast);
  const columns: Column<PackageEntry>[] = [
    { id: "name", header: "Package", sortValue: (r) => r.name, cell: (r) => (
      <div className="flex items-center gap-2.5">
        <Boxes className="size-4 shrink-0 text-ink-tertiary" />
        <div className="min-w-0">
          <p className="truncate font-mono text-[0.8125rem] text-ink">{r.name}</p>
          <p className="truncate text-caption text-ink-tertiary">{r.registry} · {r.versions} versions</p>
        </div>
      </div>
    ) },
    { id: "size", header: "Size", sortValue: (r) => r.sizeMb, align: "right", cell: (r) => <span className="tabular-nums text-ink-muted">{fromMb(r.sizeMb)}</span> },
    { id: "untagged", header: "Untagged layers", sortValue: (r) => r.untaggedLayers, align: "right", hideBelow: "sm", cell: (r) => r.untaggedLayers > 0 ? <Badge tone="warning">{r.untaggedLayers}</Badge> : <span className="text-caption text-ink-tertiary">0</span> },
    { id: "action", header: "", align: "right", cell: (r) => r.untaggedLayers > 0 ? (
      <Button variant="ghost" size="sm" onClick={() => addToast({ title: "Pruned untagged layers", description: `${r.name} · ${fromMb(r.sizeMb * 0.2)} reclaimed`, variant: "success" })}>
        <Trash2 className="size-3.5" /> Prune
      </Button>
    ) : null },
  ];
  return <DataTable tableKey="packages" columns={columns} rows={rows} getRowId={(r) => r.id} empty={{ icon: Package, title: "No packages", description: "No published packages." }} />;
}
