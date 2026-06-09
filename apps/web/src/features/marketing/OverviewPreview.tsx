import { ShieldCheck, AlertTriangle, PiggyBank, FolderGit2, ArrowRight } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { Badge } from "@/components/ui/Badge";
import { ScoreBar } from "@/components/ui/Meters";
import { LiveIndicator } from "@/components/ui/LiveIndicator";
import { PostureTrendChart } from "@/components/charts/PostureTrendChart";
import { SeverityDonut, SeverityLegend } from "@/components/charts/SeverityDonut";
import { CostAreaChart } from "@/components/charts/CostAreaChart";
import {
  severityBreakdown,
  totalOpenFindings,
  topRiskRepos,
  postureDelta,
  membersWithout2fa,
} from "@/data/metrics";
import { scoreToGrade, GRADE_COLOR, SEVERITY } from "@/lib/severity";
import { currency, fromMb, relativeTime, pluralize, percent } from "@/lib/format";
import { reclaimableMb } from "@/data/metrics";
import { eventIcon } from "@/features/notifications/eventMeta";
import { cn } from "@/lib/cn";
import type { Dataset } from "@contracts/types";

/**
 * A non-interactive copy of the real Overview dashboard, built from the same
 * primitives + charts, for use as the marketing "product screenshot". Kept in
 * sync with OverviewPage by reusing its building blocks.
 */
export function OverviewPreview({ ds }: { ds: Dataset }) {
  const sev = severityBreakdown(ds);
  const findings = totalOpenFindings(ds);
  const grade = scoreToGrade(ds.account.postureScore);
  const delta = postureDelta(ds);
  const atRisk = ds.repos.filter((r) => r.hygieneScore < 65 || r.openSecrets > 0).length;
  const topRepos = topRiskRepos(ds, 5);
  const criticalEvents = ds.events
    .filter((e) => e.severity === "critical" || e.severity === "high")
    .slice(0, 4);

  const coverage = [
    {
      label: "Branch protection",
      value: ds.repos.filter((r) => r.branchProtected).length / Math.max(1, ds.repos.length),
      hex: "#5e6ad2",
    },
    {
      label: "2FA enabled",
      value: 1 - membersWithout2fa(ds).length / Math.max(1, ds.members.length),
      hex: "#27a644",
    },
    {
      label: "CI / SAST",
      value: ds.repos.filter((r) => r.hasCI).length / Math.max(1, ds.repos.length),
      hex: "#5b9bf0",
    },
    {
      label: "OIDC in workflows",
      value: ds.workflows.length
        ? ds.workflows.filter((w) => w.usesOidc).length / ds.workflows.length
        : 0,
      hex: "#828fff",
    },
  ];

  return (
    <div className="space-y-5 bg-canvas p-6">
      {/* header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-eyebrow uppercase text-ink-tertiary">{ds.account.name}</p>
          <h1 className="text-headline font-semibold text-ink">Overview</h1>
          <p className="mt-1 text-body-sm text-ink-subtle">
            Security posture, reclaimable spend and critical events across your account and
            organizations.
          </p>
        </div>
        <LiveIndicator>
          Last scan {relativeTime(ds.events[0]?.createdAt ?? new Date().toISOString())}
        </LiveIndicator>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <StatTile
          label="Security posture"
          value={<span className={GRADE_COLOR[grade].text}>{ds.account.postureScore}</span>}
          icon={<ShieldCheck className="size-4" />}
          delta={delta}
          goodDirection="up"
          hint={
            <>
              Grade <span className={cn("font-semibold", GRADE_COLOR[grade].text)}>{grade}</span>
            </>
          }
          accent="#5e6ad2"
        />
        <StatTile
          label="Open findings"
          value={findings}
          icon={<AlertTriangle className="size-4" />}
          hint={
            <>
              <span className="text-critical">{sev.critical} critical</span> · {sev.high} high
            </>
          }
          goodDirection="down"
        />
        <StatTile
          label="Reclaimable spend"
          value={currency(ds.account.reclaimable)}
          icon={<PiggyBank className="size-4" />}
          hint={`${fromMb(reclaimableMb(ds))} of storage`}
          accent="#27a644"
        />
        <StatTile
          label="Repos at risk"
          value={atRisk}
          icon={<FolderGit2 className="size-4" />}
          hint={`of ${pluralize(ds.repos.length, "repo")}`}
          goodDirection="down"
        />
      </div>

      {/* trend + donut */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader
            title="Security posture trend"
            description="Composite score over the last 30 days"
            action={
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg text-card-title font-semibold ring-1 ring-inset",
                  GRADE_COLOR[grade].text,
                  GRADE_COLOR[grade].ring,
                )}
              >
                {grade}
              </div>
            }
          />
          <div className="px-2 pb-3">
            <PostureTrendChart data={ds.postureTrend} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Findings by severity" description="Across secrets, vulns & code" />
          <div className="flex flex-col items-center gap-4 p-4 pt-0">
            <SeverityDonut counts={sev} />
            <div className="w-full">
              <SeverityLegend counts={sev} />
            </div>
          </div>
        </Card>
      </div>

      {/* cost + coverage */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader
            title="Spend & reclaimable storage"
            description="Estimated monthly GitHub spend"
            action={
              <Badge tone="success" dot>
                {currency(ds.account.reclaimable)} reclaimable
              </Badge>
            }
          />
          <div className="px-2 pb-3">
            <CostAreaChart data={ds.usage.series} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Security coverage" description="Controls enabled across repos" />
          <div className="space-y-4 p-4 pt-0">
            {coverage.map((c) => (
              <div key={c.label}>
                <div className="mb-1.5 flex items-center justify-between text-body-sm">
                  <span className="text-ink-muted">{c.label}</span>
                  <span className="font-medium tabular-nums text-ink">{percent(c.value)}</span>
                </div>
                <ScoreBar value={c.value} hex={c.hex} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* leaderboard + events */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader
            title="Repositories at highest risk"
            action={
              <span className="flex items-center gap-1 text-caption text-ink-subtle">
                View all <ArrowRight className="size-3" />
              </span>
            }
          />
          <div className="divide-y divide-hairline border-t border-hairline">
            {topRepos.map((r) => {
              const g = scoreToGrade(r.hygieneScore);
              return (
                <div key={r.id} className="flex items-center gap-3 px-4 py-2.5">
                  <FolderGit2 className="size-4 shrink-0 text-ink-tertiary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-sm text-ink">{r.name}</p>
                    <p className="truncate text-caption text-ink-tertiary">
                      {r.openVulns} vulns · {r.openSecrets} secrets · {r.openCodeAlerts} alerts
                    </p>
                  </div>
                  <ScoreBar
                    value={r.hygieneScore / 100}
                    hex={GRADE_COLOR[g].hex}
                    className="w-20"
                  />
                  <span
                    className={cn("w-5 text-right text-body-sm font-semibold", GRADE_COLOR[g].text)}
                  >
                    {g}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <CardHeader
            title="Recent critical events"
            action={
              <span className="flex items-center gap-1 text-caption text-ink-subtle">
                View all <ArrowRight className="size-3" />
              </span>
            }
          />
          <div className="divide-y divide-hairline border-t border-hairline">
            {criticalEvents.map((e) => {
              const Icon = eventIcon(e.type);
              const s = SEVERITY[e.severity];
              return (
                <div key={e.id} className="flex items-start gap-3 px-4 py-2.5">
                  <span
                    className={cn(
                      "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg",
                      s.badge,
                    )}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-body-sm text-ink">{e.message}</p>
                    <p className="text-caption text-ink-tertiary">{relativeTime(e.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
