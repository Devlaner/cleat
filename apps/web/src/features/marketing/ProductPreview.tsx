import type { ComponentType } from "react";
import { Search, ScanLine, Bell, Command, ChevronsUpDown } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { ScaledFrame } from "@/components/ui/ScaledFrame";
import { OverviewPreview } from "./OverviewPreview";
import { VulnerabilitiesPreview } from "./previews/VulnerabilitiesPreview";
import { SupplyChainPreview } from "./previews/SupplyChainPreview";
import { ArtifactsPreview } from "./previews/ArtifactsPreview";
import { NAV, type CountKey } from "@/config/nav";
import { getDataset } from "@/data";
import { sidebarCounts } from "@/data/metrics";
import { cn } from "@/lib/cn";
import type { Dataset } from "@contracts/types";

// Design size chosen so that at the widest marketing container the preview
// renders at ~native scale (minimal downscaling keeps the sidebar crisp).
const DESIGN_W = 1240;
const VIEWPORT_H = 780;

export type PreviewScreen = "overview" | "vulnerabilities" | "supply-chain" | "artifacts";

interface ScreenDef {
  active: string;
  url: string;
  account: string;
  Body: ComponentType<{ ds: Dataset }>;
}

const SCREENS: Record<PreviewScreen, ScreenDef> = {
  overview: {
    active: "/app/overview",
    url: "overview",
    account: "acct_aurora",
    Body: OverviewPreview,
  },
  vulnerabilities: {
    active: "/app/security/vulnerabilities",
    url: "security/vulnerabilities",
    account: "acct_helios",
    Body: VulnerabilitiesPreview,
  },
  "supply-chain": {
    active: "/app/supply-chain",
    url: "supply-chain",
    account: "acct_helios",
    Body: SupplyChainPreview,
  },
  artifacts: {
    active: "/app/artifacts",
    url: "artifacts",
    account: "acct_helios",
    Body: ArtifactsPreview,
  },
};

/**
 * Marketing "product screenshot": the real Cleat app UI (sidebar + top bar +
 * a chosen screen) rendered live and scaled into a browser frame. Stays
 * pixel-identical to the product because it uses the same components.
 */
export function ProductPreview({ screen = "overview" }: { screen?: PreviewScreen }) {
  const def = SCREENS[screen];
  const ds = getDataset(def.account);
  const Body = def.Body;

  return (
    <div
      data-preview={screen}
      className="panel-highlight overflow-hidden rounded-xl border border-hairline-strong bg-surface-1 text-left shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
    >
      {/* browser chrome (unscaled, crisp) */}
      <div className="flex items-center gap-2 border-b border-hairline bg-canvas px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-hairline-tertiary" />
        <span className="size-2.5 rounded-full bg-hairline-tertiary" />
        <span className="size-2.5 rounded-full bg-hairline-tertiary" />
        <div className="mx-auto flex items-center gap-1.5 rounded-md bg-surface-2 px-3 py-1 text-[0.6875rem] text-ink-tertiary">
          <span className="size-1.5 rounded-full bg-success" />
          app.cleat.dev/{def.url}
        </div>
      </div>

      <ScaledFrame designWidth={DESIGN_W} viewportHeight={VIEWPORT_H}>
        <div className="flex h-full w-full overflow-hidden bg-canvas">
          <PreviewSidebar ds={ds} active={def.active} />
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <PreviewTopBar />
            <div className="min-h-0 flex-1 overflow-hidden">
              <Body ds={ds} />
            </div>
          </div>
        </div>
      </ScaledFrame>
    </div>
  );
}

function PreviewSidebar({ ds, active }: { ds: Dataset; active: string }) {
  const base = sidebarCounts(ds);
  const counts: Partial<Record<CountKey, number>> = { ...base, notifications: ds.events.length };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-hairline bg-canvas">
      <div className="flex h-14 items-center gap-2 px-3">
        <LogoMark size={26} />
        <span className="text-[1.05rem] font-semibold tracking-[-0.02em] text-ink">Cleat</span>
      </div>
      <div className="px-2 pb-2">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <Avatar seed={ds.account.login} label={ds.account.name} size={28} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-body-sm font-medium text-ink">{ds.account.name}</p>
            <p className="truncate text-caption text-ink-subtle">
              Organization · {ds.account.plan}
            </p>
          </div>
          <ChevronsUpDown className="size-4 shrink-0 text-ink-tertiary" />
        </div>
      </div>
      <nav className="flex-1 space-y-4 px-2 py-2">
        {NAV.map((section, i) => (
          <div key={i}>
            {section.title && (
              <p className="px-2.5 pb-1.5 text-[0.6875rem] font-medium uppercase tracking-wide text-ink-tertiary">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.to === active;
                const count = item.countKey ? counts[item.countKey] : undefined;
                return (
                  <div
                    key={item.to}
                    className={cn(
                      "relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-body-sm font-medium",
                      isActive ? "bg-surface-2 text-ink" : "text-ink-subtle",
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                    )}
                    <Icon className="size-[18px] shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {count ? (
                      <span className="ml-auto rounded-full bg-surface-3 px-1.5 py-px text-[0.6875rem] tabular-nums text-ink-muted">
                        {count > 99 ? "99+" : count}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-hairline p-2">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <Avatar seed="fuadev" label="Fuad Alizada" size={28} rounded="full" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-body-sm font-medium text-ink">Fuad Alizada</p>
            <p className="truncate text-caption text-ink-subtle">@fuadev</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function PreviewTopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-hairline bg-canvas px-4">
      <div className="flex h-9 w-full max-w-xs items-center gap-2 rounded-md border border-hairline bg-surface-1 px-3 text-ink-subtle">
        <Search className="size-4" />
        <span className="text-body-sm">Search or jump to…</span>
        <kbd className="ml-auto flex items-center gap-0.5 rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[0.6875rem]">
          <Command className="size-3" />K
        </kbd>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <span className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-button font-medium text-on-primary">
          <ScanLine className="size-3.5" /> Run scan
        </span>
        <span className="relative flex size-9 items-center justify-center rounded-md text-ink-subtle">
          <Bell className="size-[18px]" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-critical" />
        </span>
      </div>
    </header>
  );
}
