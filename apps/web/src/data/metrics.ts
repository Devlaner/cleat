import type { Severity } from "@/lib/severity";
import type { Dataset, Repo, Vulnerability } from "./types";

/**
 * Composite "fix-first" priority (0–100) combining severity, real-world exploit
 * likelihood (EPSS), confirmed exploitation (KEV) and code reachability - the
 * modern best-practice prioritization stack.
 */
export function vulnPriority(v: Vulnerability): number {
  const sev = (v.cvss / 10) * 34;
  const epss = v.epss * 34;
  const kev = v.kev ? 20 : 0;
  const reach = v.reachable === "reachable" ? 12 : v.reachable === "unknown" ? 5 : 0;
  return Math.round(Math.min(100, sev + epss + kev + reach));
}

export type SeverityCounts = Record<Severity, number>;

const emptyCounts = (): SeverityCounts => ({ critical: 0, high: 0, medium: 0, low: 0, info: 0 });

/** Secrets that are still live (active or unknown validity). */
export function activeSecrets(ds: Dataset) {
  return ds.secrets.filter((s) => s.validity !== "revoked");
}

export function openCodeAlerts(ds: Dataset) {
  return ds.codeAlerts.filter((a) => a.status === "open");
}

/** Count of unpinned third-party actions across all workflows. */
export function unpinnedActionCount(ds: Dataset): number {
  return ds.workflows.reduce((sum, w) => sum + w.actions.filter((a) => !a.pinned).length, 0);
}

/** Aggregate open findings into a severity breakdown for charts. */
export function severityBreakdown(ds: Dataset): SeverityCounts {
  const c = emptyCounts();
  for (const s of activeSecrets(ds)) c[s.severity]++;
  for (const v of ds.vulnerabilities) c[v.severity]++;
  for (const a of openCodeAlerts(ds)) c[a.severity]++;
  return c;
}

export function totalOpenFindings(ds: Dataset): number {
  const c = severityBreakdown(ds);
  return c.critical + c.high + c.medium + c.low + c.info;
}

export function membersWithout2fa(ds: Dataset) {
  return ds.members.filter((m) => !m.twoFactor);
}

/** A composite 0–100 risk score for ranking repos on the leaderboard. */
export function repoRisk(repo: Repo): number {
  return (
    repo.openSecrets * 30 +
    repo.openVulns * 6 +
    repo.openCodeAlerts * 4 +
    (repo.branchProtected ? 0 : 20) +
    (100 - repo.hygieneScore) * 0.5
  );
}

export function topRiskRepos(ds: Dataset, n = 6): Repo[] {
  return [...ds.repos].sort((a, b) => repoRisk(b) - repoRisk(a)).slice(0, n);
}

/** Reclaimable artifact + cache storage in MB. */
export function reclaimableMb(ds: Dataset): number {
  const oldArtifacts = ds.artifacts
    .filter((a) => a.downloads === 0 || Date.now() - +new Date(a.createdAt) > 30 * 86_400_000)
    .reduce((s, a) => s + a.sizeMb, 0);
  const staleCaches = ds.caches
    .filter((c) => Date.now() - +new Date(c.lastUsedAt) > 7 * 86_400_000)
    .reduce((s, c) => s + c.sizeMb, 0);
  const untagged = ds.packages.reduce((s, p) => s + (p.untaggedLayers > 0 ? p.sizeMb * 0.2 : 0), 0);
  return oldArtifacts + staleCaches + untagged;
}

/** Sidebar badge counts for the active account. */
export interface SidebarCounts {
  secrets: number;
  vulnerabilities: number;
  codeScanning: number;
  supplyChain: number;
}

export function sidebarCounts(ds: Dataset): SidebarCounts {
  return {
    secrets: activeSecrets(ds).length,
    vulnerabilities: ds.vulnerabilities.length,
    codeScanning: openCodeAlerts(ds).length,
    supplyChain: unpinnedActionCount(ds),
  };
}

/** Posture delta from the trend series (first vs last point). */
export function postureDelta(ds: Dataset): number {
  const t = ds.postureTrend;
  if (t.length < 2) return 0;
  return t[t.length - 1]!.score - t[0]!.score;
}
