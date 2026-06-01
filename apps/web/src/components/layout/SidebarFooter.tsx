import { useNavigate } from "react-router-dom";
import { LogOut, Settings, LifeBuoy } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { GithubMark } from "@/components/ui/GithubMark";
import { Popover, MenuItem } from "@/components/ui/Popover";
import { cn } from "@/lib/cn";
import { ACCOUNTS } from "@/data/accounts";
import { useOrgStore } from "@/stores/useOrgStore";
import { useUiStore } from "@/stores/useUiStore";

export function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();
  const disconnect = useOrgStore((s) => s.disconnect);
  const addToast = useUiStore((s) => s.addToast);
  const me = ACCOUNTS[0]!;

  return (
    <div className="border-t border-hairline p-2">
      <Popover
        align="start"
        className="w-full"
        trigger={(open) => (
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-2",
              collapsed && "justify-center px-0",
              open && "bg-surface-2",
            )}
          >
            <Avatar seed={me.login} label={me.name} size={28} rounded="full" />
            {!collapsed && (
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-body-sm font-medium text-ink">{me.name}</p>
                <p className="truncate text-caption text-ink-subtle">@{me.login}</p>
              </div>
            )}
          </div>
        )}
      >
        {(close) => (
          <div className="w-56">
            <div className="flex items-center gap-2 px-2.5 py-2">
              <Avatar seed={me.login} label={me.name} size={32} rounded="full" />
              <div className="min-w-0">
                <p className="truncate text-body-sm font-medium text-ink">{me.name}</p>
                <p className="truncate text-caption text-ink-subtle">
                  {me.name.toLowerCase().replace(" ", ".")}@example.com
                </p>
              </div>
            </div>
            <div className="my-1 border-t border-hairline" />
            <MenuItem
              icon={<Settings className="size-4" />}
              onClick={() => {
                navigate("/app/settings");
                close();
              }}
            >
              Settings
            </MenuItem>
            <MenuItem
              icon={<GithubMark size={16} />}
              onClick={() => {
                addToast({
                  title: "GitHub connection healthy",
                  description: "Last synced just now.",
                  variant: "success",
                });
                close();
              }}
            >
              GitHub connection
            </MenuItem>
            <MenuItem icon={<LifeBuoy className="size-4" />} onClick={close}>
              Help & docs
            </MenuItem>
            <div className="my-1 border-t border-hairline" />
            <MenuItem
              icon={<LogOut className="size-4" />}
              danger
              onClick={() => {
                disconnect();
                navigate("/");
              }}
            >
              Disconnect
            </MenuItem>
          </div>
        )}
      </Popover>
    </div>
  );
}
