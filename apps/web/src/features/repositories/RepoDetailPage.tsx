import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Lock, Globe, Building2, Star, GitBranch, GitPullRequest, Check, X,
  ShieldCheck, ShieldX, FileText, Scale, Users, ScrollText, Workflow, Archive, KeyRound, ShieldAlert, ScanLine,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { SummaryStats } from "@/components/ui/SummaryStats";
import { Badge, SeverityBadge } from "@/components/ui/Badge";
import { ScoreBar } from "@/components/ui/Meters";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDataset } from "@/hooks/useDataset";
import { scoreToGrade, GRADE_COLOR, SEVERITY, type Severity } from "@/lib/severity";
import { languageColor } from "@/lib/ecosystems";
import { relativeTime, compactNumber, fromMb, percent } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Repo, Visibility, ScorecardCheck } from "@/data/types";

const VIS: Record<Visibility, { icon: typeof Lock; label: string }> = {
  private: { icon: Lock, label: "Private" },
  public: { icon: Globe, label: "Public" },
  internal: { icon: Building2, label: "Internal" },
};

function scoreHex(score: number) {
  if (score >= 8) return "#27a644";
  if (score >= 5) return "#ecc24a";
  if (score >= 3) return "#ff9352";
  return "#fb5b78";
}

export function RepoDetailPage() {
  const { repoId } = useParams();
  const ds = useDataset();
  const repo = ds.repos.find((r) => r.id === repoId);

  if (!repo) {
    return (
      <div className="space-y-5">
        <BackLink />
        <Card>
          <EmptyState icon={FileText} title="Repository not found" description="It may belong to a different organization." />
        </Card>
      </div>
    );
  }

  const grade = scoreToGrade(repo.hygieneScore);
  const Vis = VIS[repo.visibility];
  const secrets = ds.secrets.filter((s) => s.repo === repo.name);
  const codeAlerts = ds.codeAlerts.filter((a) => a.repo === repo.name && a.status === "open");
  const vulns = ds.vulnerabilities.filter((v) => v.affectedRepos.includes(repo.name));

  const files = [
    { label: "README", ok: repo.hasReadme, icon: FileText },
    { label: "LICENSE", ok: repo.hasLicense, icon: Scale },
    { label: "CONTRIBUTING", ok: repo.hasContributing, icon: ScrollText },
    { label: "CODEOWNERS", ok: repo.hasCodeowners, icon: Users },
    { label: "CI workflow", ok: repo.hasCI, icon: Workflow },
    { label: "Branch protection", ok: repo.branchProtected, icon: repo.branchProtected ? ShieldCheck : ShieldX },
  ];

  return (
    <div className="space-y-5">
      <BackLink />
      <PageHeader
        eyebrow={ds.account.name}
        title={
          <span className="flex items-center gap-2.5">
            <Vis.icon className="size-5 text-ink-tertiary" />
            {repo.name}
            {repo.archived && <Badge tone="muted"><Archive className="size-3" /> Archived</Badge>}
          </span>
        }
        description={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ backgroundColor: languageColor(repo.language) }} />{repo.language}</span>
            <span className="flex items-center gap-1"><Star className="size-3.5" /> {compactNumber(repo.stars)}</span>
            <span className="flex items-center gap-1"><GitBranch className="size-3.5" /> {repo.defaultBranch}</span>
            <span>{fromMb(repo.sizeMb)}</span>
            <span>updated {relativeTime(repo.lastPushedAt)}</span>
          </span>
        }
        actions={
          <div className={cn("flex size-12 flex-col items-center justify-center rounded-xl text-headline font-semibold ring-1 ring-inset", GRADE_COLOR[grade].text, GRADE_COLOR[grade].ring)}>
            {grade}
          </div>
        }
      />

      <SummaryStats
        items={[
          { label: "Hygiene score", value: repo.hygieneScore, tone: GRADE_COLOR[grade].text },
          { label: "Open vulnerabilities", value: vulns.length, tone: vulns.length ? "text-high" : "text-success", icon: <ShieldAlert className="size-3.5" /> },
          { label: "Secrets", value: secrets.length, tone: secrets.some((s) => s.validity === "active") ? "text-critical" : undefined, icon: <KeyRound className="size-3.5" /> },
          { label: "Stale branches", value: repo.staleBranches, tone: repo.staleBranches > 6 ? "text-high" : undefined, icon: <GitBranch className="size-3.5" /> },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Scorecard */}
        <Card>
          <CardHeader title="Hygiene scorecard" description="OpenSSF-style checks, scored 0–10" />
          <div className="space-y-3 p-4 pt-0">
            {repo.scorecard.map((c) => (
              <ScorecardRow key={c.id} check={c} />
            ))}
          </div>
        </Card>

        {/* Health */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Repository health" description="Files & protections" />
            <div className="grid grid-cols-2 gap-2 p-4 pt-0">
              {files.map((f) => (
                <div key={f.label} className={cn("flex items-center gap-2.5 rounded-lg border p-2.5", f.ok ? "border-hairline bg-surface-2" : "border-high/25 bg-high/[0.06]")}>
                  <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-md", f.ok ? "bg-success/15 text-success" : "bg-high/15 text-high")}>
                    {f.ok ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                  </span>
                  <span className="truncate text-body-sm text-ink-muted">{f.label}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Activity" />
            <div className="grid grid-cols-3 divide-x divide-hairline border-t border-hairline">
              <Stat icon={<GitPullRequest className="size-4" />} value={repo.openPRs} label="Open PRs" />
              <Stat icon={<GitBranch className="size-4" />} value={repo.staleBranches} label="Stale branches" />
              <Stat icon={<ScanLine className="size-4" />} value={codeAlerts.length} label="Code alerts" />
            </div>
          </Card>
        </div>
      </div>

      {/* Findings */}
      <Card>
        <CardHeader title="Open findings" description="Security issues detected in this repository" />
        <div className="border-t border-hairline">
          {vulns.length === 0 && secrets.length === 0 && codeAlerts.length === 0 ? (
            <EmptyState icon={ShieldCheck} tone="success" title="No open findings" description="This repository is clean." />
          ) : (
            <div className="divide-y divide-hairline">
              {secrets.map((s) => (
                <FindingRow key={s.id} icon={KeyRound} severity={s.severity} title={s.secretType} meta={`${s.file}:${s.line}`} tag={s.validity === "active" ? "Active" : "Revoked"} tagTone={s.validity === "active" ? "text-critical" : "text-ink-tertiary"} />
              ))}
              {vulns.map((v) => (
                <FindingRow key={v.id} icon={ShieldAlert} severity={v.severity} title={v.title} meta={`${v.package} ${v.currentVersion}`} tag={`CVSS ${v.cvss.toFixed(1)}`} tagTone={SEVERITY[v.severity].text} />
              ))}
              {codeAlerts.map((a) => (
                <FindingRow key={a.id} icon={ScanLine} severity={a.severity} title={a.rule} meta={`${a.file}:${a.line}`} tag={a.tool} tagTone="text-ink-subtle" />
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function BackLink() {
  return (
    <Link to="/app/repositories" className="inline-flex items-center gap-1.5 text-body-sm text-ink-subtle transition-colors hover:text-ink">
      <ArrowLeft className="size-4" /> Repositories
    </Link>
  );
}

function ScorecardRow({ check }: { check: ScorecardCheck }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-body-sm text-ink-muted">{check.name}</span>
        <span className="font-mono text-caption tabular-nums" style={{ color: scoreHex(check.score) }}>{check.score}/10</span>
      </div>
      <ScoreBar value={check.score / 10} hex={scoreHex(check.score)} height={5} />
      <p className="mt-1 text-caption text-ink-tertiary">{check.reason}</p>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 p-4">
      <span className="text-ink-tertiary">{icon}</span>
      <span className="text-card-title font-semibold tabular-nums text-ink">{value}</span>
      <span className="text-caption text-ink-subtle">{label}</span>
    </div>
  );
}

function FindingRow({ icon: Icon, severity, title, meta, tag, tagTone }: { icon: typeof KeyRound; severity: Severity; title: string; meta: string; tag: string; tagTone: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg", SEVERITY[severity].badge)}>
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-sm text-ink">{title}</p>
        <p className="truncate font-mono text-caption text-ink-tertiary">{meta}</p>
      </div>
      <SeverityBadge severity={severity} showDot={false} />
      <span className={cn("hidden w-20 text-right text-caption sm:block", tagTone)}>{tag}</span>
    </div>
  );
}
