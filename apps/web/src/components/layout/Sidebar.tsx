import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/cn";
import { NAV, type NavItem, type CountKey } from "@/config/nav";
import { LogoMark } from "@/components/ui/Logo";
import { Tooltip } from "@/components/ui/Tooltip";
import { OrgSwitcher } from "./OrgSwitcher";
import { SidebarFooter } from "./SidebarFooter";
import { useUiStore } from "@/stores/useUiStore";
import { useDataset } from "@/hooks/useDataset";
import { useNotifications } from "@/hooks/useNotifications";
import { sidebarCounts } from "@/data/metrics";
import { TailSpin } from "react-loader-spinner";

export function Sidebar({ forceExpanded = false }: { forceExpanded?: boolean }) {
  const storeCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggle = useUiStore((s) => s.toggleSidebar);
  const collapsed = forceExpanded ? false : storeCollapsed;

  const ds = useDataset();
  const { unread } = useNotifications();
  if (!ds) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="text-[clamp(28px,5vw,60px)]">
          <TailSpin height="1em" width="1em" color="#5e6ad2" ariaLabel="loading" />
        </div>
      </div>
    );
  }
  const base = sidebarCounts(ds);
  const counts: Record<CountKey, number> = {
    ...base,
    artifactsReclaimable: 0,
    notifications: unread,
  };

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-hairline bg-canvas transition-[width] duration-200",
        collapsed ? "w-[68px]" : "w-60",
      )}
    >
      {/* Brand + collapse */}
      <div className={cn("flex h-14 items-center gap-2 px-3", collapsed && "justify-center px-0")}>
        <NavLink to="/app/overview" className="flex items-center gap-2">
          <LogoMark size={26} />
          {!collapsed && (
            <span className="text-[1.05rem] font-semibold tracking-[-0.02em] text-ink">Cleat</span>
          )}
        </NavLink>
        {!collapsed && (
          <button
            onClick={toggle}
            className="ml-auto rounded-md p-1.5 text-ink-tertiary transition-colors hover:bg-surface-2 hover:text-ink"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="size-4" />
          </button>
        )}
      </div>

      {/* Org switcher */}
      <div className="px-2 pb-2">
        {collapsed ? (
          <button
            onClick={toggle}
            className="mx-auto flex size-9 items-center justify-center rounded-md text-ink-tertiary transition-colors hover:bg-surface-2 hover:text-ink"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="size-4" />
          </button>
        ) : (
          <OrgSwitcher />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-4 overflow-y-auto px-2 py-2">
        {NAV.map((section, i) => (
          <div key={i}>
            {section.title && !collapsed && (
              <p className="px-2.5 pb-1.5 text-[0.6875rem] font-medium uppercase tracking-wide text-ink-tertiary">
                {section.title}
              </p>
            )}
            {section.title && collapsed && i > 0 && (
              <div className="mx-2 mb-2 border-t border-hairline" />
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarLink
                  key={item.to}
                  item={item}
                  collapsed={collapsed}
                  count={item.countKey ? counts[item.countKey] : undefined}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}

function SidebarLink({
  item,
  collapsed,
  count,
}: {
  item: NavItem;
  collapsed: boolean;
  count?: number;
}) {
  const Icon = item.icon;
  const hasCount = typeof count === "number" && count > 0;
  const link = (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-body-sm font-medium transition-colors",
          collapsed && "justify-center px-0",
          isActive ? "bg-surface-2 text-ink" : "text-ink-subtle hover:bg-surface-1 hover:text-ink",
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
          )}
          <span className="relative">
            <Icon className="size-[18px] shrink-0" />
            {collapsed && hasCount && (
              <span className="absolute -right-1 -top-1 size-1.5 rounded-full bg-primary" />
            )}
          </span>
          {!collapsed && <span className="truncate">{item.label}</span>}
          {!collapsed && hasCount && (
            <span className="ml-auto rounded-full bg-surface-3 px-1.5 py-px text-[0.6875rem] tabular-nums text-ink-muted">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip label={item.label} side="right" className="block">
        {link}
      </Tooltip>
    );
  }
  return link;
}
