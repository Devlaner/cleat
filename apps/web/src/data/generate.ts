import { cvssToSeverity } from "@/lib/severity";
import type { Severity } from "@cleat/contracts";
import { Rng } from "./rng";
import {
  REPO_NAMES,
  LANGUAGES,
  TOPICS,
  SECRET_PROVIDERS,
  SECRET_FILES,
  PACKAGES,
  VULN_TITLES,
  CWES,
  CODE_RULES,
  ACTIONS,
  WORKFLOW_FILES,
  FIRST_NAMES,
  LAST_NAMES,
  TEAMS,
  OAUTH_APPS,
  WEBHOOK_EVENTS,
  PAT_SCOPES,
} from "./catalog";
import type {
  Account,
  Dataset,
  Repo,
  SecretFinding,
  Vulnerability,
  CodeScanAlert,
  WorkflowAudit,
  SupplyChainIncident,
  Artifact,
  CacheEntry,
  PackageEntry,
  Usage,
  Member,
  InstalledApp,
  Webhook,
  AccessKey,
  Pat,
  ActivityEvent,
  PostureTrendPoint,
  ScorecardCheck,
  Visibility,
} from "./types";

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

function fullName(r: Rng): string {
  return `${r.pick(FIRST_NAMES)} ${r.pick(LAST_NAMES)}`;
}
function login(name: string, r: Rng): string {
  return name.toLowerCase().replace(/[^a-z]+/g, "-") + r.int(1, 99);
}

function scorecardFor(repo: Omit<Repo, "scorecard" | "hygieneScore">, r: Rng): ScorecardCheck[] {
  const unpinned = !repo.hasCI ? 0 : r.int(0, 8);
  return [
    {
      id: "branch-protection",
      name: "Branch-Protection",
      score: repo.branchProtected ? r.int(7, 10) : r.int(0, 3),
      reason: repo.branchProtected
        ? "default branch is protected"
        : "no protection on default branch",
    },
    {
      id: "code-review",
      name: "Code-Review",
      score: repo.branchProtected ? r.int(6, 10) : r.int(2, 6),
      reason: "reviews on recent changes",
    },
    {
      id: "pinned-dependencies",
      name: "Pinned-Dependencies",
      score: clamp(10 - unpinned, 0, 10),
      reason: unpinned > 0 ? `${unpinned} unpinned dependencies` : "dependencies are pinned",
    },
    {
      id: "token-permissions",
      name: "Token-Permissions",
      score: r.int(3, 10),
      reason: "GITHUB_TOKEN permission scope",
    },
    {
      id: "dangerous-workflow",
      name: "Dangerous-Workflow",
      score: r.int(5, 10),
      reason: "no dangerous workflow patterns",
    },
    {
      id: "maintained",
      name: "Maintained",
      score: repo.archived ? r.int(0, 2) : r.int(5, 10),
      reason: repo.archived ? "repository is archived" : "active commits in last 90 days",
    },
    {
      id: "sast",
      name: "SAST",
      score: repo.hasCI ? r.int(4, 10) : r.int(0, 4),
      reason: repo.hasCI ? "SAST configured in CI" : "no SAST tooling detected",
    },
    {
      id: "vulnerabilities",
      name: "Vulnerabilities",
      score: clamp(10 - repo.openVulns, 0, 10),
      reason: repo.openVulns > 0 ? `${repo.openVulns} open advisories` : "no open advisories",
    },
  ];
}

function hygiene(repo: Omit<Repo, "hygieneScore" | "scorecard">): number {
  let s = 100;
  if (!repo.branchProtected) s -= 20;
  if (!repo.hasReadme) s -= 6;
  if (!repo.hasLicense) s -= 6;
  if (!repo.hasContributing) s -= 3;
  if (!repo.hasCodeowners) s -= 5;
  if (!repo.hasCI) s -= 10;
  if (repo.staleBranches > 6) s -= 8;
  if (repo.archived) s -= 12;
  s -= clamp(repo.openVulns * 1.5, 0, 22);
  s -= repo.openSecrets * 6;
  return clamp(Math.round(s), 24, 100);
}

function genRepos(r: Rng, account: Account): Repo[] {
  const count = clamp(account.repoCount, 1, 90);
  const names = r.pickN(REPO_NAMES, Math.min(count, REPO_NAMES.length));
  const repos: Repo[] = [];
  const personal = account.type === "user";

  for (let i = 0; i < count; i++) {
    const base = names[i] ?? `${r.pick(REPO_NAMES)}-${i}`;
    const name = i < names.length ? base : `${base}-${i}`;
    const visibility: Visibility = personal
      ? r.weighted<Visibility>([
          ["public", 6],
          ["private", 4],
        ])
      : r.weighted<Visibility>([
          ["private", 6],
          ["internal", 2],
          ["public", 2],
        ]);
    const archived = r.chance(0.08);
    const hasCI = r.chance(personal ? 0.5 : 0.78);

    const partial = {
      id: `${account.id}_repo_${i}`,
      name,
      accountId: account.id,
      visibility,
      language: r.pick(LANGUAGES),
      stars: r.weighted([
        [r.int(0, 40), 6],
        [r.int(40, 800), 3],
        [r.int(800, 12000), 1],
      ]),
      defaultBranch: r.chance(0.85) ? "main" : "master",
      branchProtected: r.chance(personal ? 0.4 : 0.62),
      hasReadme: r.chance(0.86),
      hasLicense: r.chance(personal ? 0.45 : 0.66),
      hasContributing: r.chance(0.42),
      hasCodeowners: r.chance(personal ? 0.18 : 0.4),
      hasCI,
      sizeMb: r.weighted([
        [r.int(1, 60), 5],
        [r.int(60, 500), 3],
        [r.int(500, 2400), 1],
      ]),
      lastPushedAt: r.daysAgo(0, archived ? 400 : 180),
      archived,
      openVulns: 0,
      openSecrets: 0,
      openCodeAlerts: 0,
      staleBranches: r.weighted([
        [0, 3],
        [r.int(1, 5), 4],
        [r.int(5, 16), 2],
      ]),
      openPRs: r.int(0, 18),
      topics: r.pickN(TOPICS, r.int(1, 4)),
    };
    repos.push({ ...partial, scorecard: [], hygieneScore: 0 });
  }
  return repos;
}

function genSecrets(r: Rng, repos: Repo[], account: Account): SecretFinding[] {
  const target = clamp(Math.round(account.repoCount * 0.22), 3, 34);
  const out: SecretFinding[] = [];
  for (let i = 0; i < target; i++) {
    const repo = r.pick(repos);
    const sp = r.pick(SECRET_PROVIDERS);
    const validity = r.weighted<SecretFinding["validity"]>([
      ["active", 4],
      ["revoked", 5],
      ["unknown", 2],
    ]);
    const severity: Severity =
      validity === "active"
        ? r.weighted<Severity>([
            ["critical", 6],
            ["high", 4],
          ])
        : r.weighted<Severity>([
            ["high", 3],
            ["medium", 4],
            ["low", 3],
          ]);
    out.push({
      id: `${account.id}_secret_${i}`,
      accountId: account.id,
      repo: repo.name,
      provider: sp.provider,
      secretType: sp.type,
      file: r.pick(SECRET_FILES),
      line: r.int(1, 240),
      commit: r.hex(7),
      author: fullName(r),
      detectedAt: r.daysAgo(0, 120),
      validity,
      severity,
      pushProtectionBlocked: r.chance(0.3),
    });
    if (validity !== "revoked") repo.openSecrets += 1;
  }
  return out;
}

function genVulns(r: Rng, repos: Repo[], account: Account): Vulnerability[] {
  const target = clamp(Math.round(account.repoCount * 0.6), 6, 64);
  const ecosystems = Object.keys(PACKAGES);
  const out: Vulnerability[] = [];
  for (let i = 0; i < target; i++) {
    const ecosystem = r.pick(ecosystems);
    const pkg = r.pick(PACKAGES[ecosystem]!);
    const cvss = r.weighted([
      [r.range(9, 10, 1), 2],
      [r.range(7, 8.9, 1), 4],
      [r.range(4, 6.9, 1), 5],
      [r.range(0.1, 3.9, 1), 2],
    ]);
    const severity = cvssToSeverity(cvss);
    const affected = r.pickN(repos, r.int(1, 4)).map((rp) => rp.name);
    const kev = severity === "critical" ? r.chance(0.5) : r.chance(0.12);
    const major = r.int(1, 6);
    out.push({
      id: `${account.id}_vuln_${i}`,
      accountId: account.id,
      package: pkg,
      ecosystem,
      currentVersion: `${major}.${r.int(0, 9)}.${r.int(0, 20)}`,
      fixedVersion: r.chance(0.85) ? `${major}.${r.int(0, 9)}.${r.int(0, 30)}` : null,
      cvss,
      severity,
      epss: r.weighted([
        [r.range(0.5, 0.97, 3), 2],
        [r.range(0.05, 0.5, 3), 4],
        [r.range(0.001, 0.05, 3), 5],
      ]),
      kev,
      reachable: r.weighted<Vulnerability["reachable"]>([
        ["reachable", 4],
        ["not-reachable", 4],
        ["unknown", 2],
      ]),
      advisoryId: `GHSA-${r.hex(4)}-${r.hex(4)}-${r.hex(4)}`,
      cwe: r.pick(CWES),
      title: `${pkg}: ${r.pick(VULN_TITLES)}`,
      affectedRepos: affected,
      hasFixPr: r.chance(0.45),
      publishedAt: r.daysAgo(1, 220),
    });
    for (const name of affected) {
      const rp = repos.find((x) => x.name === name);
      if (rp) rp.openVulns += 1;
    }
  }
  return out;
}

function genCodeAlerts(r: Rng, repos: Repo[], account: Account): CodeScanAlert[] {
  const target = clamp(Math.round(account.repoCount * 0.7), 5, 70);
  const out: CodeScanAlert[] = [];
  for (let i = 0; i < target; i++) {
    const repo = r.pick(repos);
    const rule = r.pick(CODE_RULES);
    const status = r.weighted<CodeScanAlert["status"]>([
      ["open", 6],
      ["fixed", 3],
      ["dismissed", 1],
    ]);
    out.push({
      id: `${account.id}_code_${i}`,
      accountId: account.id,
      repo: repo.name,
      rule: rule.rule,
      ruleId: rule.ruleId,
      severity: r.weighted<Severity>([
        ["critical", 1],
        ["high", 3],
        ["medium", 4],
        ["low", 2],
      ]),
      file: `src/${r.pick(["api", "lib", "utils", "routes", "models", "handlers"])}/${r.pick(["index", "auth", "user", "query", "parse", "render"])}.${r.pick(["ts", "js", "py"])}`,
      line: r.int(5, 480),
      branch: repo.defaultBranch,
      status,
      tool: r.pick(["CodeQL", "CodeQL", "Semgrep"]),
      detectedAt: r.daysAgo(0, 160),
      description: rule.desc,
    });
    if (status === "open") repo.openCodeAlerts += 1;
  }
  return out;
}

function genWorkflows(r: Rng, repos: Repo[], account: Account): WorkflowAudit[] {
  const out: WorkflowAudit[] = [];
  const ciRepos = repos.filter((rp) => rp.hasCI);
  for (const repo of ciRepos) {
    const n = r.int(1, 3);
    const files = r.pickN(WORKFLOW_FILES, n);
    for (let j = 0; j < n; j++) {
      const actionDefs = r.pickN(ACTIONS, r.int(2, 6));
      const actions = actionDefs.map((a) => {
        const pinned = a.popular ? r.chance(0.55) : r.chance(0.25);
        return {
          name: a.name,
          ref: pinned ? r.hex(40) : r.pick(["v4", "v3", "main", "master", "v2"]),
          pinned,
          recommendedSha: r.hex(40),
          popular: a.popular,
        };
      });
      const unpinned = actions.filter((a) => !a.pinned).length;
      const permissions = r.weighted<"broad" | "scoped">([
        ["broad", 3],
        ["scoped", 5],
      ]);
      const usesOidc = r.chance(0.4);
      const risk = clamp(
        unpinned * 14 + (permissions === "broad" ? 28 : 0) + (usesOidc ? 0 : 12),
        0,
        100,
      );
      out.push({
        id: `${account.id}_wf_${repo.id}_${j}`,
        accountId: account.id,
        repo: repo.name,
        workflow: `.github/workflows/${files[j] ?? "ci.yml"}`,
        actions,
        permissions,
        usesOidc,
        hasSecrets: r.chance(0.6),
        lastRunAt: r.daysAgo(0, 30),
        runsPerWeek: r.int(1, 80),
        riskScore: risk,
      });
    }
  }
  return out;
}

function genIncidents(r: Rng, account: Account): SupplyChainIncident[] {
  const base: Omit<SupplyChainIncident, "id" | "affectedReposCount" | "status">[] = [
    {
      title: "tj-actions/changed-files compromised",
      cve: "CVE-2025-30066",
      affectedAction: "tj-actions/changed-files",
      severity: "critical",
      summary:
        "Malicious code injected via retagged versions dumped CI secrets into build logs. Pin to a full commit SHA.",
      publishedAt: r.daysAgo(40, 70),
    },
    {
      title: "Shai-Hulud npm worm propagation",
      cve: "GHSA-shai-hulud",
      affectedAction: "npm: multiple packages",
      severity: "high",
      summary:
        "Self-propagating npm compromise reusing token-extraction techniques. Audit recently installed packages.",
      publishedAt: r.daysAgo(10, 30),
    },
    {
      title: "reviewdog action token exposure",
      cve: "CVE-2025-30154",
      affectedAction: "reviewdog/action-setup",
      severity: "high",
      summary: "A compromised action exposed GITHUB_TOKEN in logs for affected workflows.",
      publishedAt: r.daysAgo(35, 65),
    },
    {
      title: "Unpinned third-party action drift",
      cve: "No CVE",
      affectedAction: "multiple",
      severity: "medium",
      summary:
        "Several workflows reference mutable tags (@v4, @main) instead of immutable commit SHAs.",
      publishedAt: r.daysAgo(2, 14),
    },
  ];
  return base.map((b, i) => ({
    ...b,
    id: `${account.id}_inc_${i}`,
    affectedReposCount: r.int(1, Math.max(2, Math.round(account.repoCount * 0.15))),
    status: r.weighted<SupplyChainIncident["status"]>([
      ["action-required", 4],
      ["monitoring", 3],
      ["resolved", 3],
    ]),
  }));
}

function genArtifacts(r: Rng, repos: Repo[], account: Account): Artifact[] {
  const target = clamp(account.repoCount * 2, 10, 120);
  const names = [
    "build-output",
    "dist",
    "coverage-report",
    "test-results",
    "docker-image",
    "playwright-report",
    "bundle-stats",
    "sourcemaps",
    "android-apk",
    "ios-ipa",
  ];
  const out: Artifact[] = [];
  for (let i = 0; i < target; i++) {
    const repo = r.pick(repos);
    const created = r.daysAgo(0, 90);
    out.push({
      id: `${account.id}_art_${i}`,
      accountId: account.id,
      repo: repo.name,
      name: `${r.pick(names)}-${r.hex(6)}`,
      sizeMb: r.weighted([
        [r.range(1, 50, 1), 5],
        [r.range(50, 400, 1), 3],
        [r.range(400, 2200, 1), 2],
      ]),
      createdAt: created,
      expiresAt: r.daysAhead(0, 90),
      workflowRun: `#${r.int(120, 9800)}`,
      downloads: r.weighted([
        [0, 6],
        [r.int(1, 12), 3],
        [r.int(12, 200), 1],
      ]),
    });
  }
  return out;
}

function genCaches(r: Rng, repos: Repo[], account: Account): CacheEntry[] {
  const target = clamp(account.repoCount, 8, 80);
  const out: CacheEntry[] = [];
  for (let i = 0; i < target; i++) {
    const repo = r.pick(repos);
    out.push({
      id: `${account.id}_cache_${i}`,
      accountId: account.id,
      repo: repo.name,
      key: `${r.pick(["npm", "pip", "gradle", "cargo", "go"])}-${r.pick(["linux", "macos", "windows"])}-${r.hex(8)}`,
      ref: r.chance(0.7) ? "refs/heads/main" : `refs/pull/${r.int(10, 900)}/merge`,
      sizeMb: r.range(20, 1400, 1),
      lastUsedAt: r.daysAgo(0, 40),
    });
  }
  return out;
}

function genPackages(r: Rng, repos: Repo[], account: Account): PackageEntry[] {
  const target = clamp(Math.round(account.repoCount * 0.4), 4, 40);
  const out: PackageEntry[] = [];
  for (let i = 0; i < target; i++) {
    const repo = r.pick(repos);
    const registry = r.pick(["ghcr.io", "npm", "container"]);
    out.push({
      id: `${account.id}_pkg_${i}`,
      accountId: account.id,
      repo: repo.name,
      name: `${account.login}/${repo.name}`,
      registry,
      versions: r.int(3, 120),
      sizeMb: r.range(40, 3200, 1),
      untaggedLayers: r.weighted([
        [0, 3],
        [r.int(1, 40), 4],
        [r.int(40, 200), 2],
      ]),
      lastPublishedAt: r.daysAgo(0, 120),
    });
  }
  return out;
}

function genUsage(r: Rng, account: Account): Usage {
  const minutesIncluded = account.plan === "Free" ? 2000 : account.plan === "Team" ? 3000 : 50000;
  const storageIncludedGb = account.plan === "Free" ? 1 : account.plan === "Team" ? 2 : 50;
  const actionsMinutes = Math.round(minutesIncluded * r.range(0.4, 1.3, 2));
  const storageGb = r.range(storageIncludedGb * 0.5, storageIncludedGb * 4, 1);
  const breakdown = [
    { label: "Actions minutes", cost: Math.round(account.monthlySpend * 0.42), hex: "#5e6ad2" },
    { label: "Artifact storage", cost: Math.round(account.monthlySpend * 0.31), hex: "#828fff" },
    { label: "Packages", cost: Math.round(account.monthlySpend * 0.18), hex: "#7a7fad" },
    { label: "LFS / other", cost: Math.round(account.monthlySpend * 0.09), hex: "#3e3e44" },
  ];
  const months = [
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
  ];
  const series = months.map((label, i) => ({
    label,
    minutes: Math.round(actionsMinutes * r.range(0.6, 1.1, 2) * (0.7 + i * 0.03)),
    storageGb: r.range(storageGb * 0.6, storageGb * 1.1, 1),
    cost: Math.round(account.monthlySpend * r.range(0.6, 1.05, 2) * (0.7 + i * 0.03)),
  }));
  return {
    actionsMinutes,
    minutesIncluded,
    storageGb,
    storageIncludedGb,
    monthlyCost: account.monthlySpend,
    reclaimable: account.reclaimable,
    breakdown,
    series,
  };
}

function genMembers(r: Rng, account: Account): Member[] {
  if (account.type === "user") {
    return [
      {
        id: `${account.id}_m0`,
        login: account.login,
        name: account.name,
        role: "owner",
        twoFactor: true,
        lastActiveAt: r.daysAgo(0, 1),
        teams: [],
        outsideCollaborator: false,
        repoAccess: account.repoCount,
      },
    ];
  }
  const count = clamp(account.memberCount, 1, 60);
  const out: Member[] = [];
  for (let i = 0; i < count; i++) {
    const name = fullName(r);
    const role =
      i === 0
        ? "owner"
        : r.weighted<Member["role"]>([
            ["owner", 1],
            ["admin", 2],
            ["member", 12],
          ]);
    const outside = r.chance(0.12);
    out.push({
      id: `${account.id}_m${i}`,
      login: login(name, r),
      name,
      role,
      twoFactor: r.chance(0.82),
      lastActiveAt: r.daysAgo(0, 120),
      teams: outside ? [] : r.pickN(TEAMS, r.int(1, 3)),
      outsideCollaborator: outside,
      repoAccess: outside ? r.int(1, 4) : r.int(3, account.repoCount),
    });
  }
  return out;
}

function genApps(r: Rng, account: Account): InstalledApp[] {
  const chosen = r.pickN(OAUTH_APPS, r.int(5, OAUTH_APPS.length));
  return chosen.map((a, i) => {
    const risky = a.perms.some((p) => p.includes("admin") || p.includes("delete") || p === "repo");
    return {
      id: `${account.id}_app_${i}`,
      accountId: account.id,
      name: a.name,
      kind: a.kind,
      permissions: a.perms,
      installedBy: fullName(r),
      installedAt: r.daysAgo(20, 600),
      repoAccess: r.chance(0.4) ? "all" : r.int(1, account.repoCount),
      lastUsedAt: r.daysAgo(0, 200),
      risk: risky
        ? r.weighted<Severity>([
            ["high", 3],
            ["medium", 3],
            ["critical", 1],
          ])
        : r.weighted<Severity>([
            ["low", 3],
            ["info", 3],
            ["medium", 1],
          ]),
    };
  });
}

function genWebhooks(r: Rng, repos: Repo[], account: Account): Webhook[] {
  const target = clamp(Math.round(account.repoCount * 0.3), 3, 24);
  const out: Webhook[] = [];
  const hosts = [
    "hooks.slack.com",
    "api.example.com",
    "ci.internal.dev",
    "deploy.acme.io",
    "n8n.self-hosted.net",
    "discord.com/api/webhooks",
  ];
  for (let i = 0; i < target; i++) {
    const ok = r.chance(0.78);
    out.push({
      id: `${account.id}_hook_${i}`,
      accountId: account.id,
      scope: r.chance(0.4) ? "organization" : r.pick(repos).name,
      url: `https://${r.pick(hosts)}/${r.hex(10)}`,
      events: r.pickN(WEBHOOK_EVENTS, r.int(1, 4)),
      active: r.chance(0.85),
      lastDelivery: r.daysAgo(0, 30),
      lastStatus: ok ? r.pick([200, 200, 204]) : r.pick([401, 404, 500, 410]),
    });
  }
  return out;
}

function genKeys(r: Rng, repos: Repo[], account: Account): AccessKey[] {
  const out: AccessKey[] = [];
  const deploys = clamp(Math.round(account.repoCount * 0.2), 1, 16);
  for (let i = 0; i < deploys; i++) {
    out.push({
      id: `${account.id}_dk_${i}`,
      accountId: account.id,
      kind: "deploy",
      title: `${r.pick(["ci", "prod", "staging", "backup"])}-deploy-key`,
      repo: r.pick(repos).name,
      fingerprint: `SHA256:${r.hex(43)}`,
      addedAt: r.daysAgo(30, 700),
      lastUsedAt: r.chance(0.7) ? r.daysAgo(0, 90) : null,
      readOnly: r.chance(0.6),
    });
  }
  for (let i = 0; i < r.int(2, 5); i++) {
    out.push({
      id: `${account.id}_sk_${i}`,
      accountId: account.id,
      kind: "ssh",
      title: `${r.pick(["macbook", "workstation", "laptop", "server"])}-${r.hex(4)}`,
      fingerprint: `SHA256:${r.hex(43)}`,
      addedAt: r.daysAgo(30, 900),
      lastUsedAt: r.chance(0.6) ? r.daysAgo(0, 120) : null,
    });
  }
  for (let i = 0; i < r.int(1, 2); i++) {
    out.push({
      id: `${account.id}_gk_${i}`,
      accountId: account.id,
      kind: "gpg",
      title: `signing-key-${r.hex(4)}`,
      fingerprint: r.hex(16).toUpperCase(),
      addedAt: r.daysAgo(60, 900),
      lastUsedAt: r.chance(0.5) ? r.daysAgo(0, 60) : null,
    });
  }
  return out;
}

function genPats(r: Rng, account: Account): Pat[] {
  const count = r.int(4, 12);
  const out: Pat[] = [];
  for (let i = 0; i < count; i++) {
    const kind = r.weighted<Pat["kind"]>([
      ["classic", 5],
      ["fine-grained", 4],
    ]);
    const scopes =
      kind === "classic"
        ? r.pickN(PAT_SCOPES, r.int(1, 5))
        : r.pickN(
            [
              "contents:read",
              "contents:write",
              "metadata:read",
              "pull_requests:write",
              "actions:read",
            ],
            r.int(1, 3),
          );
    const expires = r.weighted<"none" | "future" | "past">([
      ["none", 3],
      ["future", 4],
      ["past", 2],
    ]);
    out.push({
      id: `${account.id}_pat_${i}`,
      accountId: account.id,
      name: `${r.pick(["ci", "local-dev", "deploy", "automation", "backup", "homelab", "release-bot"])}-${r.hex(4)}`,
      kind,
      scopes,
      createdAt: r.daysAgo(20, 720),
      lastUsedAt: r.chance(0.75) ? r.daysAgo(0, 90) : null,
      expiresAt:
        expires === "none" ? null : expires === "future" ? r.daysAhead(1, 120) : r.daysAgo(1, 60),
    });
  }
  return out;
}

function genEvents(r: Rng, repos: Repo[], account: Account): ActivityEvent[] {
  const templates: {
    type: string;
    category: ActivityEvent["category"];
    severity: Severity;
    msg: (repo: string, actor: string) => string;
  }[] = [
    {
      type: "secret.detected",
      category: "security",
      severity: "critical",
      msg: (repo) => `Active AWS secret detected in ${repo}`,
    },
    {
      type: "branch_protection.disabled",
      category: "access",
      severity: "high",
      msg: (repo, a) => `${a} disabled branch protection on ${repo}`,
    },
    {
      type: "repo.made_public",
      category: "access",
      severity: "high",
      msg: (repo, a) => `${a} changed ${repo} visibility to public`,
    },
    {
      type: "member.added_admin",
      category: "access",
      severity: "high",
      msg: (_r, a) => `${a} was granted admin on the organization`,
    },
    {
      type: "oauth_app.created",
      category: "access",
      severity: "medium",
      msg: (_r, a) => `${a} authorized a new OAuth app`,
    },
    {
      type: "action.unpinned",
      category: "supply-chain",
      severity: "medium",
      msg: (repo) => `Unpinned third-party action found in ${repo}`,
    },
    {
      type: "force_push.main",
      category: "maintenance",
      severity: "medium",
      msg: (repo, a) => `${a} force-pushed to main on ${repo}`,
    },
    {
      type: "vuln.kev",
      category: "security",
      severity: "critical",
      msg: (repo) => `Actively exploited (KEV) advisory affects ${repo}`,
    },
    {
      type: "deploy_key.added",
      category: "access",
      severity: "low",
      msg: (repo, a) => `${a} added a deploy key to ${repo}`,
    },
    {
      type: "fix_pr.merged",
      category: "maintenance",
      severity: "info",
      msg: (repo, a) => `${a} merged a Dependabot fix PR in ${repo}`,
    },
    {
      type: "2fa.disabled",
      category: "access",
      severity: "high",
      msg: (_r, a) => `${a} disabled two-factor authentication`,
    },
    {
      type: "webhook.failing",
      category: "maintenance",
      severity: "low",
      msg: (repo) => `Webhook deliveries failing for ${repo}`,
    },
  ];
  const count = r.int(26, 42);
  const out: ActivityEvent[] = [];
  for (let i = 0; i < count; i++) {
    const t = r.pick(templates);
    const repo = r.pick(repos).name;
    const actor = fullName(r);
    out.push({
      id: `${account.id}_evt_${i}`,
      accountId: account.id,
      type: t.type,
      severity: t.severity,
      actor,
      target: repo,
      repo,
      message: t.msg(repo, actor),
      createdAt: r.daysAgo(0, 21),
      category: t.category,
    });
  }
  return out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

function genPostureTrend(r: Rng, account: Account): PostureTrendPoint[] {
  const out: PostureTrendPoint[] = [];
  const end = account.postureScore;
  const start = clamp(end - r.int(4, 16), 30, 100);
  for (let i = 29; i >= 0; i--) {
    const t = (29 - i) / 29;
    const score = clamp(Math.round(start + (end - start) * t + r.range(-2.5, 2.5, 1)), 20, 100);
    out.push({
      date: new Date(Date.now() - i * 86_400_000).toISOString(),
      score,
      critical: clamp(Math.round((100 - score) * 0.12 + r.range(-1, 1, 1)), 0, 14),
      high: clamp(Math.round((100 - score) * 0.3 + r.range(-2, 2, 1)), 0, 40),
      medium: clamp(Math.round((100 - score) * 0.5 + r.range(-3, 3, 1)), 0, 70),
      low: clamp(Math.round((100 - score) * 0.7 + r.range(-3, 3, 1)), 0, 90),
    });
  }
  return out;
}

/** Build a complete, deterministic dataset for one account. */
export function generateDataset(account: Account): Dataset {
  const r = new Rng(account.id);
  const repos = genRepos(r, account);
  const secrets = genSecrets(r, repos, account);
  const vulnerabilities = genVulns(r, repos, account);
  const codeAlerts = genCodeAlerts(r, repos, account);

  // finalize repo-derived fields now that finding counts are known
  for (const repo of repos) {
    repo.scorecard = scorecardFor(repo, r);
    repo.hygieneScore = hygiene(repo);
  }

  return {
    account,
    repos,
    secrets,
    vulnerabilities,
    codeAlerts,
    workflows: genWorkflows(r, repos, account),
    incidents: genIncidents(r, account),
    artifacts: genArtifacts(r, repos, account),
    caches: genCaches(r, repos, account),
    packages: genPackages(r, repos, account),
    usage: genUsage(r, account),
    members: genMembers(r, account),
    apps: genApps(r, account),
    webhooks: genWebhooks(r, repos, account),
    keys: genKeys(r, repos, account),
    pats: genPats(r, account),
    events: genEvents(r, repos, account),
    postureTrend: genPostureTrend(r, account),
  };
}
