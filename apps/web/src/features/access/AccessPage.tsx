import { useState } from "react";
import { Users, ShieldX, UserMinus, AppWindow } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SummaryStats } from "@/components/ui/SummaryStats";
import { Tabs } from "@/components/ui/Tabs";
import { useDataset } from "@/hooks/useDataset";
import { membersWithout2fa } from "@/data/metrics";
import { MembersTab } from "./MembersTab";
import { AppsTab } from "./AppsTab";
import { WebhooksTab } from "./WebhooksTab";
import { KeysTab } from "./KeysTab";
import { TokensTab } from "./TokensTab";
import { AuditLogTab } from "./AuditLogTab";

type Tab = "members" | "apps" | "webhooks" | "keys" | "tokens" | "audit";

export function AccessPage() {
  const { data: ds, error, loading } = useDataset();
  const [tab, setTab] = useState<Tab>("members");

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div
          className="size-8 animate-spin rounded-full border-2 border-surface-3 border-t-primary"
          aria-label="loading"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-sm text-ink-subtle">
        Failed to load access data.
      </div>
    );
  }

  if (!ds) {
    return (
      <div className="flex h-[60vh] items-center justify-center px-4 text-center">
        <div>
          <p className="text-sm font-medium text-ink">No access data available</p>
        </div>
      </div>
    );
  }
  const without2fa = membersWithout2fa(ds).length;
  const outside = ds.members.filter((m) => m.outsideCollaborator).length;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Governance"
        title="Access & audit"
        description="Review who and what can touch your code: members, apps, webhooks, keys and tokens, plus a full activity audit log."
      />

      <SummaryStats
        items={[
          { label: "Members", value: ds.members.length, icon: <Users className="size-3.5" /> },
          {
            label: "Without 2FA",
            value: without2fa,
            tone: without2fa > 0 ? "text-critical" : "text-success",
            icon: <ShieldX className="size-3.5" />,
          },
          {
            label: "Outside collaborators",
            value: outside,
            tone: outside > 0 ? "text-high" : undefined,
            icon: <UserMinus className="size-3.5" />,
          },
          {
            label: "Installed apps",
            value: ds.apps.length,
            icon: <AppWindow className="size-3.5" />,
          },
        ]}
      />

      <Tabs
        value={tab}
        onChange={(t) => setTab(t as Tab)}
        tabs={[
          { id: "members", label: "Members", count: ds.members.length },
          { id: "apps", label: "Apps", count: ds.apps.length },
          { id: "webhooks", label: "Webhooks", count: ds.webhooks.length },
          { id: "keys", label: "Keys", count: ds.keys.length },
          { id: "tokens", label: "Tokens", count: ds.pats.length },
          { id: "audit", label: "Audit log", count: ds.events.length },
        ]}
      />

      <div>
        {tab === "members" && <MembersTab members={ds.members} />}
        {tab === "apps" && <AppsTab apps={ds.apps} />}
        {tab === "webhooks" && <WebhooksTab webhooks={ds.webhooks} />}
        {tab === "keys" && <KeysTab keys={ds.keys} />}
        {tab === "tokens" && <TokensTab pats={ds.pats} />}
        {tab === "audit" && <AuditLogTab events={ds.events} />}
      </div>
    </div>
  );
}
