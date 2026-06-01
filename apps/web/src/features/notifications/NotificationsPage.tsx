import { useMemo, useState } from "react";
import { isToday, isYesterday } from "date-fns";
import { Bell, BellOff, Check, Mail, MessageSquare, Webhook, Plus, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SummaryStats } from "@/components/ui/SummaryStats";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, SeverityBadge } from "@/components/ui/Badge";
import { Segmented } from "@/components/ui/Tabs";
import { Switch } from "@/components/ui/Switch";
import { EmptyState } from "@/components/ui/EmptyState";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useUiStore } from "@/stores/useUiStore";
import { SEVERITY } from "@/lib/severity";
import { relativeTime, shortDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { eventIcon, CATEGORY_LABEL } from "./eventMeta";
import type { NotificationItem } from "@/hooks/useNotifications";

const RULES = [
  {
    id: "secret",
    label: "Active secret detected",
    severity: "critical" as const,
    channels: ["email", "slack"],
  },
  {
    id: "kev",
    label: "Actively exploited (KEV) advisory",
    severity: "critical" as const,
    channels: ["email", "slack"],
  },
  {
    id: "protection",
    label: "Branch protection disabled",
    severity: "high" as const,
    channels: ["slack"],
  },
  {
    id: "public",
    label: "Repository made public",
    severity: "high" as const,
    channels: ["email", "slack"],
  },
  {
    id: "admin",
    label: "New owner or admin added",
    severity: "high" as const,
    channels: ["email"],
  },
  {
    id: "oauth",
    label: "New OAuth app authorized",
    severity: "medium" as const,
    channels: ["slack"],
  },
  {
    id: "forcepush",
    label: "Force-push to default branch",
    severity: "medium" as const,
    channels: [],
  },
];

const CHANNEL_ICON = { email: Mail, slack: MessageSquare, webhook: Webhook } as const;

export function NotificationsPage() {
  const { items, unread } = useNotifications();
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const markRead = useNotificationStore((s) => s.markRead);
  const addToast = useUiStore((s) => s.addToast);

  const [view, setView] = useState("all");
  const [rules, setRules] = useState(() => Object.fromEntries(RULES.map((r) => [r.id, true])));

  const filtered = useMemo(() => {
    if (view === "unread") return items.filter((i) => !i.read);
    if (view === "critical")
      return items.filter((i) => i.severity === "critical" || i.severity === "high");
    return items;
  }, [items, view]);

  const groups = useMemo(() => groupByDay(filtered), [filtered]);
  const critical = items.filter((i) => i.severity === "critical").length;
  const thisWeek = items.filter((i) => Date.now() - +new Date(i.createdAt) < 7 * 86_400_000).length;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Governance"
        title="Notifications"
        description="Critical events across your account and organizations, plus the rules that decide what reaches you."
        actions={
          unread > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => markAllRead(items.map((i) => i.id))}
            >
              <Check className="size-3.5" /> Mark all read
            </Button>
          )
        }
      />

      <SummaryStats
        items={[
          {
            label: "Unread",
            value: unread,
            tone: unread > 0 ? "text-primary-hover" : undefined,
            icon: <Bell className="size-3.5" />,
          },
          {
            label: "Critical",
            value: critical,
            tone: critical > 0 ? "text-critical" : "text-success",
          },
          { label: "This week", value: thisWeek },
          {
            label: "Active rules",
            value: Object.values(rules).filter(Boolean).length,
            icon: <Sparkles className="size-3.5" />,
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Feed */}
        <div className="space-y-4 lg:col-span-2">
          <Segmented
            options={[
              { id: "all", label: "All" },
              { id: "unread", label: `Unread${unread ? ` · ${unread}` : ""}` },
              { id: "critical", label: "Critical" },
            ]}
            value={view}
            onChange={setView}
          />
          {groups.length === 0 ? (
            <Card>
              <EmptyState
                icon={BellOff}
                tone="success"
                title="Nothing here"
                description="No notifications match this view."
              />
            </Card>
          ) : (
            groups.map(([label, group]) => (
              <div key={label}>
                <p className="mb-2 px-1 text-caption font-medium uppercase tracking-wide text-ink-tertiary">
                  {label}
                </p>
                <Card className="divide-y divide-hairline overflow-hidden">
                  {group.map((n) => (
                    <NotificationRow key={n.id} item={n} onRead={() => markRead(n.id)} />
                  ))}
                </Card>
              </div>
            ))
          )}
        </div>

        {/* Alert rules */}
        <div>
          <Card>
            <CardHeader
              title="Alert rules"
              description="What triggers a notification"
              action={
                <button
                  onClick={() =>
                    addToast({
                      title: "Rule builder",
                      description: "Create a custom alert rule.",
                      variant: "info",
                    })
                  }
                  className="text-ink-subtle transition-colors hover:text-ink"
                >
                  <Plus className="size-4" />
                </button>
              }
            />
            <div className="divide-y divide-hairline border-t border-hairline">
              {RULES.map((rule) => (
                <div key={rule.id} className="flex items-center gap-3 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-sm text-ink">{rule.label}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <SeverityBadge severity={rule.severity} showDot={false} />
                      <div className="flex items-center gap-1 text-ink-tertiary">
                        {rule.channels.length === 0 ? (
                          <span className="text-caption">in-app only</span>
                        ) : (
                          rule.channels.map((c) => {
                            const Icon = CHANNEL_ICON[c as keyof typeof CHANNEL_ICON];
                            return <Icon key={c} className="size-3" />;
                          })
                        )}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={rules[rule.id]!}
                    onChange={(v) => setRules((r) => ({ ...r, [rule.id]: v }))}
                    label={rule.label}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function NotificationRow({ item, onRead }: { item: NotificationItem; onRead: () => void }) {
  const Icon = eventIcon(item.type);
  const sev = SEVERITY[item.severity];
  return (
    <button
      onClick={onRead}
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2",
        !item.read && "bg-surface-2/40",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
          sev.badge,
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body-sm text-ink">{item.message}</p>
        <div className="mt-1 flex items-center gap-2 text-caption text-ink-tertiary">
          <Badge tone="muted">{CATEGORY_LABEL[item.category]}</Badge>
          <span>{item.actor}</span>
          <span>·</span>
          <span>{relativeTime(item.createdAt)}</span>
        </div>
      </div>
      {!item.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
    </button>
  );
}

function groupByDay(items: NotificationItem[]): [string, NotificationItem[]][] {
  const buckets = new Map<string, NotificationItem[]>();
  for (const item of items) {
    const d = new Date(item.createdAt);
    const label = isToday(d) ? "Today" : isYesterday(d) ? "Yesterday" : shortDate(item.createdAt);
    const arr = buckets.get(label) ?? [];
    arr.push(item);
    buckets.set(label, arr);
  }
  return [...buckets.entries()];
}
