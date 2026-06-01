import {
  LayoutDashboard,
  KeyRound,
  ShieldAlert,
  ScanLine,
  Workflow,
  Package,
  Archive,
  FolderGit2,
  Users,
  Bell,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  /** key into the per-org alert-count map (drives sidebar badges) */
  countKey?: CountKey;
  /** end-match for NavLink active state */
  end?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export type CountKey =
  | "secrets"
  | "vulnerabilities"
  | "codeScanning"
  | "supplyChain"
  | "artifactsReclaimable"
  | "notifications";

export const NAV: NavSection[] = [
  {
    items: [{ label: "Overview", to: "/app/overview", icon: LayoutDashboard }],
  },
  {
    title: "Security",
    items: [
      { label: "Secrets", to: "/app/security/secrets", icon: KeyRound, countKey: "secrets" },
      {
        label: "Vulnerabilities",
        to: "/app/security/vulnerabilities",
        icon: ShieldAlert,
        countKey: "vulnerabilities",
      },
      {
        label: "Code scanning",
        to: "/app/security/code-scanning",
        icon: ScanLine,
        countKey: "codeScanning",
      },
    ],
  },
  {
    title: "Supply chain",
    items: [
      { label: "Actions audit", to: "/app/supply-chain", icon: Workflow, countKey: "supplyChain" },
      { label: "Dependencies", to: "/app/dependencies", icon: Package },
    ],
  },
  {
    title: "Maintenance",
    items: [
      { label: "Artifacts & cost", to: "/app/artifacts", icon: Archive },
      { label: "Repositories", to: "/app/repositories", icon: FolderGit2 },
    ],
  },
  {
    title: "Governance",
    items: [
      { label: "Access & audit", to: "/app/access", icon: Users },
      { label: "Notifications", to: "/app/notifications", icon: Bell, countKey: "notifications" },
      { label: "Settings", to: "/app/settings", icon: Settings },
    ],
  },
];

/** Flattened list - used by the command palette. */
export const ALL_NAV_ITEMS: NavItem[] = NAV.flatMap((s) => s.items);
