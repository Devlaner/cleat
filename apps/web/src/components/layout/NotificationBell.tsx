import { Bell, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Popover } from "@/components/ui/Popover";
import { EmptyState } from "@/components/ui/EmptyState";
import { SEVERITY } from "@/lib/severity";
import { relativeTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { eventIcon } from "@/features/notifications/eventMeta";

export function NotificationBell({ unread = 0 }: { unread?: number }) {
  const navigate = useNavigate();
  const { items } = useNotifications();
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const markRead = useNotificationStore((s) => s.markRead);
  const recent = items.slice(0, 6);

  return (
    <Popover
      align="end"
      trigger={(open) => (
        <span
          className={cn(
            "relative flex size-9 items-center justify-center rounded-md text-ink-subtle transition-colors hover:bg-surface-2 hover:text-ink",
            open && "bg-surface-2 text-ink",
          )}
        >
          <Bell className="size-[18px]" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex min-w-4 items-center justify-center rounded-full bg-critical px-1 text-[0.625rem] font-semibold leading-none text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </span>
      )}
    >
      {(close) => (
        <div className="w-[calc(100vw-2rem)] max-w-[22rem]">
          <div className="flex items-center justify-between px-2.5 py-2">
            <p className="text-body-sm font-medium text-ink">Notifications</p>
            {unread > 0 && (
              <button
                onClick={() => markAllRead(items.map((i) => i.id))}
                className="flex items-center gap-1 text-caption text-ink-subtle transition-colors hover:text-ink"
              >
                <Check className="size-3" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[55vh] overflow-y-auto border-t border-hairline sm:max-h-96">
            {recent.length === 0 ? (
              <EmptyState icon={Bell} title="You're all caught up" tone="success" />
            ) : (
              recent.map((n) => {
                const Icon = eventIcon(n.type);
                const sev = SEVERITY[n.severity];
                return (
                  <button
                    key={n.id}
                    onClick={() => {
                      markRead(n.id);
                      navigate("/app/notifications");
                      close();
                    }}
                    className="flex w-full items-start gap-3 border-b border-hairline px-3 py-2.5 text-left transition-colors last:border-0 hover:bg-surface-3"
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg",
                        sev.badge,
                      )}
                    >
                      <Icon className="size-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-body-sm text-ink">{n.message}</p>
                      <p className="text-caption text-ink-tertiary">{relativeTime(n.createdAt)}</p>
                    </div>
                    {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                  </button>
                );
              })
            )}
          </div>
          <div className="border-t border-hairline p-1">
            <button
              onClick={() => {
                navigate("/app/notifications");
                close();
              }}
              className="w-full rounded-md px-2.5 py-2 text-center text-body-sm font-medium text-primary-hover transition-colors hover:bg-surface-3"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </Popover>
  );
}
