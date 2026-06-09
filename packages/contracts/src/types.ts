/**
 * Cleat data model. All dummy data is typed and deterministic (seeded per
 * account) so the demo is stable across reloads. Generators live in ./generate
 * and the assembled, memoized datasets are exposed from ./index.
 */

export type AccountType = "user" | "org";
export type Plan = "Free" | "Team" | "Enterprise";

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export interface Account {
  id: string;
  login: string;
  name: string;
  type: AccountType;
  plan: Plan;
  repoCount: number;
  memberCount: number;
  postureScore: number;
  monthlySpend: number;
  reclaimable: number;
}

export type Visibility = "public" | "private" | "internal";

export interface ScorecardCheck {
  id: string;
  name: string;
  /** 0–10 OpenSSF-style score */
  score: number;
  reason: string;
}

export interface Repo {
  id: string;
  name: string;
  accountId: string;
  visibility: Visibility;
  language: string;
  stars: number;
  defaultBranch: string;
  branchProtected: boolean;
  hasReadme: boolean;
  hasLicense: boolean;
  hasContributing: boolean;
  hasCodeowners: boolean;
  hasCI: boolean;
  sizeMb: number;
  lastPushedAt: string;
  archived: boolean;
  openVulns: number;
  openSecrets: number;
  openCodeAlerts: number;
  staleBranches: number;
  openPRs: number;
  hygieneScore: number;
  scorecard: ScorecardCheck[];
  topics: string[];
}

export interface SecretFinding {
  id: string;
  accountId: string;
  repo: string;
  provider: string;
  secretType: string;
  file: string;
  line: number;
  commit: string;
  author: string;
  detectedAt: string;
  validity: "active" | "revoked" | "unknown";
  severity: Severity;
  pushProtectionBlocked: boolean;
}

export interface Vulnerability {
  id: string;
  accountId: string;
  package: string;
  ecosystem: string;
  currentVersion: string;
  fixedVersion: string | null;
  cvss: number;
  severity: Severity;
  /** EPSS exploit-probability 0..1 */
  epss: number;
  /** in CISA Known Exploited Vulnerabilities catalog */
  kev: boolean;
  reachable: "reachable" | "not-reachable" | "unknown";
  advisoryId: string;
  cwe: string;
  title: string;
  affectedRepos: string[];
  hasFixPr: boolean;
  publishedAt: string;
}

export interface CodeScanAlert {
  id: string;
  accountId: string;
  repo: string;
  rule: string;
  ruleId: string;
  severity: Severity;
  file: string;
  line: number;
  branch: string;
  status: "open" | "fixed" | "dismissed";
  tool: string;
  detectedAt: string;
  description: string;
}

export interface WorkflowAction {
  name: string;
  ref: string;
  pinned: boolean;
  recommendedSha: string;
  popular: boolean;
}

export interface WorkflowAudit {
  id: string;
  accountId: string;
  repo: string;
  workflow: string;
  actions: WorkflowAction[];
  permissions: "broad" | "scoped";
  usesOidc: boolean;
  hasSecrets: boolean;
  lastRunAt: string;
  runsPerWeek: number;
  /** 0–100, higher = riskier */
  riskScore: number;
}

export interface SupplyChainIncident {
  id: string;
  title: string;
  cve: string;
  affectedAction: string;
  severity: Severity;
  summary: string;
  affectedReposCount: number;
  publishedAt: string;
  status: "action-required" | "monitoring" | "resolved";
}

export interface Artifact {
  id: string;
  accountId: string;
  repo: string;
  name: string;
  sizeMb: number;
  createdAt: string;
  expiresAt: string;
  workflowRun: string;
  downloads: number;
}

export interface CacheEntry {
  id: string;
  accountId: string;
  repo: string;
  key: string;
  ref: string;
  sizeMb: number;
  lastUsedAt: string;
}

export interface PackageEntry {
  id: string;
  accountId: string;
  repo: string;
  name: string;
  registry: string;
  versions: number;
  sizeMb: number;
  untaggedLayers: number;
  lastPublishedAt: string;
}

export interface UsagePoint {
  label: string;
  minutes: number;
  storageGb: number;
  cost: number;
}

export interface Usage {
  actionsMinutes: number;
  minutesIncluded: number;
  storageGb: number;
  storageIncludedGb: number;
  monthlyCost: number;
  reclaimable: number;
  breakdown: { label: string; cost: number; hex: string }[];
  series: UsagePoint[];
}

export interface Member {
  id: string;
  login: string;
  name: string;
  role: "owner" | "admin" | "member";
  twoFactor: boolean;
  lastActiveAt: string;
  teams: string[];
  outsideCollaborator: boolean;
  repoAccess: number;
}

export interface InstalledApp {
  id: string;
  accountId: string;
  name: string;
  kind: "oauth" | "github-app";
  permissions: string[];
  installedBy: string;
  installedAt: string;
  /** "all" repos or a count */
  repoAccess: "all" | number;
  lastUsedAt: string;
  risk: Severity;
}

export interface Webhook {
  id: string;
  accountId: string;
  scope: string;
  url: string;
  events: string[];
  active: boolean;
  lastDelivery: string;
  lastStatus: number;
}

export interface AccessKey {
  id: string;
  accountId: string;
  kind: "deploy" | "ssh" | "gpg";
  title: string;
  repo?: string;
  fingerprint: string;
  addedAt: string;
  lastUsedAt: string | null;
  readOnly?: boolean;
}

export interface Pat {
  id: string;
  accountId: string;
  name: string;
  kind: "classic" | "fine-grained";
  scopes: string[];
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
}

export type EventCategory = "security" | "access" | "supply-chain" | "maintenance";

export interface ActivityEvent {
  id: string;
  accountId: string;
  type: string;
  severity: Severity;
  actor: string;
  target: string;
  repo?: string;
  message: string;
  createdAt: string;
  category: EventCategory;
}

export interface PostureTrendPoint {
  date: string;
  score: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface Dataset {
  account: Account;
  repos: Repo[];
  secrets: SecretFinding[];
  vulnerabilities: Vulnerability[];
  codeAlerts: CodeScanAlert[];
  workflows: WorkflowAudit[];
  incidents: SupplyChainIncident[];
  artifacts: Artifact[];
  caches: CacheEntry[];
  packages: PackageEntry[];
  usage: Usage;
  members: Member[];
  apps: InstalledApp[];
  webhooks: Webhook[];
  keys: AccessKey[];
  pats: Pat[];
  events: ActivityEvent[];
  postureTrend: PostureTrendPoint[];
}
