import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  ScanLine,
  BellRing,
  Palette,
  LogOut,
  Check,
  Moon,
  Mail,
  MessageSquare,
  Webhook,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { Segmented } from "@/components/ui/Tabs";
import { ACCOUNTS } from "@/data/accounts";
import { useOrgStore, useConnectedAccounts } from "@/stores/useOrgStore";
import { useUiStore } from "@/stores/useUiStore";
import { cn } from "@/lib/cn";

export function SettingsPage() {
  const navigate = useNavigate();
  const disconnect = useOrgStore((s) => s.disconnect);
  const connected = useConnectedAccounts();
  const addToast = useUiStore((s) => s.addToast);

  const [monitored, setMonitored] = useState<Set<string>>(new Set(connected.map((a) => a.id)));
  const [frequency, setFrequency] = useState("daily");
  const [threshold, setThreshold] = useState("high");
  const [prefs, setPrefs] = useState({
    onPush: true,
    autoFixPr: false,
    includeArchived: false,
    reduceMotion: false,
  });
  const [channels, setChannels] = useState({ email: true, slack: false, webhook: false });

  function toggleMonitored(id: string) {
    setMonitored((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    addToast({ title: "Monitoring updated", variant: "success" });
  }

  return (
    <div data-testid="settings-page" className="space-y-5">
      <PageHeader
        eyebrow="Governance"
        title="Settings"
        description="Manage connected organizations, scan behavior and how Cleat reaches you."
      />

      <Section
        icon={<Building2 className="size-4" />}
        title="Connected organizations"
        description="Accounts and organizations Cleat is monitoring."
      >
        <div className="divide-y divide-hairline">
          {ACCOUNTS.map((a) => (
            <div key={a.id} className="flex items-center gap-3 p-4">
              <Avatar seed={a.login} label={a.name} size={32} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-body-sm font-medium text-ink">{a.name}</p>
                <p className="truncate text-caption text-ink-subtle">
                  @{a.login} · {a.repoCount} repos · {a.plan}
                </p>
              </div>
              {a.type === "user" ? (
                <Badge tone="muted">Personal</Badge>
              ) : (
                <Badge tone="neutral">Org</Badge>
              )}
              <Switch
                checked={monitored.has(a.id)}
                onChange={() => toggleMonitored(a.id)}
                label={`Monitor ${a.name}`}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section
        icon={<ScanLine className="size-4" />}
        title="Scan preferences"
        description="How often Cleat scans and what it flags."
      >
        <div className="space-y-4 p-4">
          <Field label="Scan frequency">
            <Segmented
              value={frequency}
              onChange={setFrequency}
              options={[
                { id: "hourly", label: "Hourly" },
                { id: "daily", label: "Daily" },
                { id: "weekly", label: "Weekly" },
              ]}
            />
          </Field>
          <Field label="Alert threshold" hint="Minimum severity that creates a notification">
            <Segmented
              value={threshold}
              onChange={setThreshold}
              options={[
                { id: "critical", label: "Critical" },
                { id: "high", label: "High+" },
                { id: "medium", label: "Medium+" },
              ]}
            />
          </Field>
          <ToggleRow
            label="Scan on every push"
            desc="Run incremental scans as code lands"
            checked={prefs.onPush}
            onChange={(v) => setPrefs((p) => ({ ...p, onPush: v }))}
          />
          <ToggleRow
            label="Auto-open fix PRs"
            desc="Open Dependabot-style upgrade PRs automatically"
            checked={prefs.autoFixPr}
            onChange={(v) => setPrefs((p) => ({ ...p, autoFixPr: v }))}
          />
          <ToggleRow
            label="Include archived repositories"
            desc="Scan repos that are archived"
            checked={prefs.includeArchived}
            onChange={(v) => setPrefs((p) => ({ ...p, includeArchived: v }))}
          />
        </div>
      </Section>

      <Section
        icon={<BellRing className="size-4" />}
        title="Notification channels"
        description="Where critical alerts are delivered."
      >
        <div className="divide-y divide-hairline">
          <ChannelRow
            icon={<Mail className="size-4" />}
            label="Email"
            value="fuad@example.com"
            checked={channels.email}
            onChange={(v) => setChannels((c) => ({ ...c, email: v }))}
          />
          <ChannelRow
            icon={<MessageSquare className="size-4" />}
            label="Slack"
            value={channels.slack ? "#security-alerts" : "Not connected"}
            checked={channels.slack}
            onChange={(v) => setChannels((c) => ({ ...c, slack: v }))}
          />
          <ChannelRow
            icon={<Webhook className="size-4" />}
            label="Webhook"
            value={channels.webhook ? "https://hooks.internal.dev/cleat" : "Not configured"}
            checked={channels.webhook}
            onChange={(v) => setChannels((c) => ({ ...c, webhook: v }))}
          />
        </div>
      </Section>

      <Section
        icon={<Palette className="size-4" />}
        title="Appearance"
        description="Cleat is tuned for a dark, focused workspace."
      >
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-surface-2 p-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-canvas text-primary-hover ring-1 ring-inset ring-hairline">
              <Moon className="size-4" />
            </span>
            <div className="flex-1">
              <p className="text-body-sm font-medium text-ink">Dark</p>
              <p className="text-caption text-ink-subtle">The only theme, and the best one.</p>
            </div>
            <Check className="size-4 text-primary-hover" />
          </div>
          <ToggleRow
            label="Reduce motion"
            desc="Minimize animations across the app"
            checked={prefs.reduceMotion}
            onChange={(v) => setPrefs((p) => ({ ...p, reduceMotion: v }))}
          />
        </div>
      </Section>

      <Section
        icon={<LogOut className="size-4" />}
        title="Danger zone"
        description="Irreversible account actions."
        danger
      >
        <div className="flex flex-col items-start justify-between gap-3 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-body-sm font-medium text-ink">Disconnect GitHub</p>
            <p className="text-caption text-ink-subtle">
              Removes all access and returns you to the start.
            </p>
          </div>
          <Button
            variant="danger"
            onClick={() => {
              disconnect();
              navigate("/");
            }}
          >
            <LogOut className="size-4" /> Disconnect
          </Button>
        </div>
      </Section>
    </div>
  );
}

function Section({
  icon,
  title,
  description,
  children,
  danger,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "mt-0.5 flex size-7 items-center justify-center rounded-lg ring-1 ring-inset",
            danger
              ? "bg-critical/10 text-critical ring-critical/25"
              : "bg-surface-2 text-ink-subtle ring-hairline",
          )}
        >
          {icon}
        </span>
        <div>
          <h2 className="text-body-sm font-medium text-ink">{title}</h2>
          <p className="mt-0.5 text-caption text-ink-subtle">{description}</p>
        </div>
      </div>
      <Card className={cn(danger && "border-critical/25")}>{children}</Card>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-body-sm text-ink">{label}</p>
        {hint && <p className="text-caption text-ink-tertiary">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-body-sm text-ink">{label}</p>
        <p className="text-caption text-ink-tertiary">{desc}</p>
      </div>
      <Switch checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

function ChannelRow({
  icon,
  label,
  value,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <span className="flex size-8 items-center justify-center rounded-lg bg-surface-3 text-ink-subtle">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body-sm text-ink">{label}</p>
        <p className="truncate text-caption text-ink-subtle">{value}</p>
      </div>
      <Switch checked={checked} onChange={onChange} label={label} />
    </div>
  );
}
