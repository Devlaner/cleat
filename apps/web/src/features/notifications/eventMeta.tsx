import {
  KeyRound,
  ShieldOff,
  Globe,
  UserPlus,
  AppWindow,
  Workflow,
  GitCommitHorizontal,
  ShieldAlert,
  KeySquare,
  GitMerge,
  Lock,
  Webhook,
  Activity,
  type LucideIcon,
} from "lucide-react";
import type { EventCategory } from "@contracts/types";

/** Icon per event type, with a sensible fallback. */
export const EVENT_ICON: Record<string, LucideIcon> = {
  "secret.detected": KeyRound,
  "branch_protection.disabled": ShieldOff,
  "repo.made_public": Globe,
  "member.added_admin": UserPlus,
  "oauth_app.created": AppWindow,
  "action.unpinned": Workflow,
  "force_push.main": GitCommitHorizontal,
  "vuln.kev": ShieldAlert,
  "deploy_key.added": KeySquare,
  "fix_pr.merged": GitMerge,
  "2fa.disabled": Lock,
  "webhook.failing": Webhook,
};

export function eventIcon(type: string): LucideIcon {
  return EVENT_ICON[type] ?? Activity;
}

export const CATEGORY_LABEL: Record<EventCategory, string> = {
  security: "Security",
  access: "Access",
  "supply-chain": "Supply chain",
  maintenance: "Maintenance",
};
