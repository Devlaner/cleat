import { GitPullRequestArrow, ExternalLink, Flame, Crosshair, ShieldCheck } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { SeverityBadge, Badge } from "@/components/ui/Badge";
import { MonoChip } from "@/components/ui/Chip";
import { ScoreBar } from "@/components/ui/Meters";
import { ecosystem } from "@/lib/ecosystems";
import { SEVERITY } from "@/lib/severity";
import { relativeTime, percent } from "@/lib/format";
import { vulnPriority } from "@/data/metrics";
import { useUiStore } from "@/stores/useUiStore";
import { cn } from "@/lib/cn";
import type { Vulnerability } from "@/data/types";

export function VulnDetail({ vuln, onClose }: { vuln: Vulnerability | null; onClose: () => void }) {
  const addToast = useUiStore((s) => s.addToast);
  const eco = vuln ? ecosystem(vuln.ecosystem) : null;

  return (
    <Drawer
      open={!!vuln}
      onClose={onClose}
      title={vuln?.title ?? ""}
      description={
        vuln ? `${vuln.advisoryId} · published ${relativeTime(vuln.publishedAt)}` : undefined
      }
      width={500}
      footer={
        vuln && (
          <div className="flex gap-2">
            <Button
              variant="primary"
              className="flex-1"
              disabled={!vuln.fixedVersion}
              onClick={() => {
                addToast({
                  title: vuln.hasFixPr ? "Fix PR opened" : "Upgrade queued",
                  description: `${vuln.package} → ${vuln.fixedVersion}`,
                  variant: "success",
                });
                onClose();
              }}
            >
              <GitPullRequestArrow className="size-4" />
              {vuln.hasFixPr
                ? "Review fix PR"
                : vuln.fixedVersion
                  ? `Upgrade to ${vuln.fixedVersion}`
                  : "No fix available"}
            </Button>
            <Button variant="secondary">
              <ExternalLink className="size-4" /> Advisory
            </Button>
          </div>
        )
      }
    >
      {vuln && eco && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <MonoChip short={eco.short} hex={eco.hex} />
            <span className="font-mono text-body-sm text-ink">{vuln.package}</span>
            <SeverityBadge severity={vuln.severity} />
            {vuln.kev && (
              <Badge tone="danger" dot>
                Actively exploited (KEV)
              </Badge>
            )}
          </div>

          {/* prioritization stack */}
          <div className="grid grid-cols-2 gap-2">
            <Metric
              label="Priority"
              value={vulnPriority(vuln)}
              hint="fix-first score"
              hex="#5e6ad2"
              fraction={vulnPriority(vuln) / 100}
            />
            <Metric
              label="CVSS"
              value={vuln.cvss.toFixed(1)}
              hint={SEVERITY[vuln.severity].label}
              hex={SEVERITY[vuln.severity].hex}
              fraction={vuln.cvss / 10}
            />
            <Metric
              label="EPSS"
              value={percent(vuln.epss, 1)}
              hint="exploit probability"
              hex="#ff9352"
              fraction={vuln.epss}
              icon={<Flame className="size-3.5" />}
            />
            <Reachability reachable={vuln.reachable} />
          </div>

          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline">
            <Row label="Current version" value={vuln.currentVersion} mono />
            <Row label="Fixed in" value={vuln.fixedVersion ?? "No fix yet"} mono />
            <Row label="Weakness" value={vuln.cwe} />
            <Row label="Ecosystem" value={eco.label} />
          </dl>

          <div>
            <p className="mb-2 text-caption font-medium uppercase tracking-wide text-ink-tertiary">
              Affected repositories ({vuln.affectedRepos.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {vuln.affectedRepos.map((r) => (
                <span
                  key={r}
                  className="rounded-md bg-surface-2 px-2 py-1 font-mono text-caption text-ink-muted ring-1 ring-inset ring-hairline"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}

function Metric({
  label,
  value,
  hint,
  hex,
  fraction,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  hint: string;
  hex: string;
  fraction: number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-hairline bg-surface-2 p-3">
      <div className="flex items-center gap-1.5 text-caption text-ink-subtle">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-card-title font-semibold tabular-nums text-ink">{value}</p>
      <p className="mb-2 text-caption text-ink-tertiary">{hint}</p>
      <ScoreBar value={fraction} hex={hex} height={4} />
    </div>
  );
}

function Reachability({ reachable }: { reachable: Vulnerability["reachable"] }) {
  const map = {
    reachable: { tone: "text-critical", label: "Reachable", hint: "called by your code" },
    "not-reachable": { tone: "text-success", label: "Not reachable", hint: "not in a call path" },
    unknown: { tone: "text-ink-subtle", label: "Unknown", hint: "reachability not analyzed" },
  }[reachable];
  return (
    <div className="rounded-lg border border-hairline bg-surface-2 p-3">
      <div className="flex items-center gap-1.5 text-caption text-ink-subtle">
        <Crosshair className="size-3.5" /> Reachability
      </div>
      <p className={cn("mt-1 flex items-center gap-1.5 text-card-title font-semibold", map.tone)}>
        {reachable === "not-reachable" && <ShieldCheck className="size-4" />}
        {map.label}
      </p>
      <p className="text-caption text-ink-tertiary">{map.hint}</p>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-surface-1 px-3 py-2">
      <dt className="text-caption text-ink-subtle">{label}</dt>
      <dd
        className={cn(
          "min-w-0 truncate text-body-sm text-ink",
          mono && "font-mono text-[0.8125rem]",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
