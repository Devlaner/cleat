import { Menu, Search, ScanLine, Command } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NotificationBell } from "./NotificationBell";
import { useUiStore } from "@/stores/useUiStore";
import { useActiveAccount } from "@/stores/useOrgStore";
import { useNotifications } from "@/hooks/useNotifications";

export function TopBar() {
  const setMobileNav = useUiStore((s) => s.setMobileNav);
  const setCommandOpen = useUiStore((s) => s.setCommandOpen);
  const addToast = useUiStore((s) => s.addToast);
  const active = useActiveAccount();
  const { unread } = useNotifications();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-hairline bg-canvas/85 px-4 backdrop-blur-md">
      <button
        onClick={() => setMobileNav(true)}
        className="rounded-md p-1.5 text-ink-subtle transition-colors hover:bg-surface-2 hover:text-ink lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </button>

      {/* Command/search trigger */}
      <button
        onClick={() => setCommandOpen(true)}
        className="group flex h-9 w-full max-w-xs items-center gap-2 rounded-md border border-hairline bg-surface-1 px-3 text-ink-subtle transition-colors hover:border-hairline-strong"
      >
        <Search className="size-4" />
        <span className="text-body-sm">Search or jump to…</span>
        <kbd className="ml-auto hidden items-center gap-0.5 rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink-subtle sm:flex">
          <Command className="size-3" />K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="primary"
          size="sm"
          className="hidden sm:inline-flex"
          onClick={() =>
            addToast({
              title: `Scan started for ${active.name}`,
              description: "Cleat is scanning repositories, dependencies and workflows.",
              variant: "info",
            })
          }
        >
          <ScanLine className="size-3.5" />
          Run scan
        </Button>
        <NotificationBell unread={unread} />
      </div>
    </header>
  );
}
