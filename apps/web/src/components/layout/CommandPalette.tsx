import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Search, CornerDownLeft, ScanLine, LogOut, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { ALL_NAV_ITEMS } from "@/config/nav";
import { useUiStore } from "@/stores/useUiStore";
import { useOrgStore, useActiveAccount, useConnectedAccounts } from "@/stores/useOrgStore";
import { useHotkey, useEscape } from "@/lib/hooks";
import { Avatar } from "@/components/ui/Avatar";

interface Cmd {
  id: string;
  label: string;
  group: string;
  icon: React.ReactNode;
  run: () => void;
  hint?: string;
}

export function CommandPalette() {
  const open = useUiStore((s) => s.commandOpen);
  const setOpen = useUiStore((s) => s.setCommandOpen);
  const toggle = useUiStore((s) => s.toggleCommand);
  const addToast = useUiStore((s) => s.addToast);
  const setActive = useOrgStore((s) => s.setActiveAccount);
  const disconnect = useOrgStore((s) => s.disconnect);
  const accounts = useConnectedAccounts();
  const active = useActiveAccount();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  useHotkey("k", toggle, true);
  useEscape(() => setOpen(false), open);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
    }
  }, [open]);

  const commands = useMemo<Cmd[]>(() => {
    const nav: Cmd[] = ALL_NAV_ITEMS.map((item) => ({
      id: `nav:${item.to}`,
      label: item.label,
      group: "Go to",
      icon: <item.icon className="size-4" />,
      run: () => navigate(item.to),
    }));
    const switchers: Cmd[] = accounts
      .filter((a) => a.id !== active.id)
      .map((a) => ({
        id: `org:${a.id}`,
        label: `Switch to ${a.name}`,
        group: "Organizations",
        icon: <Avatar seed={a.login} label={a.name} size={18} />,
        run: () => {
          setActive(a.id);
          addToast({ title: `Switched to ${a.name}`, variant: "default" });
        },
      }));
    const actions: Cmd[] = [
      {
        id: "act:scan",
        label: "Run security scan",
        group: "Actions",
        icon: <ScanLine className="size-4" />,
        run: () => addToast({ title: `Scan started for ${active.name}`, variant: "info" }),
      },
      {
        id: "act:disconnect",
        label: "Disconnect GitHub",
        group: "Actions",
        icon: <LogOut className="size-4" />,
        run: () => {
          disconnect();
          navigate("/");
        },
      },
    ];
    return [...nav, ...switchers, ...actions];
  }, [accounts, active, navigate, setActive, disconnect, addToast]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    setCursor((c) => Math.min(c, Math.max(0, results.length - 1)));
  }, [results.length]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (c + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (c - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = results[cursor];
      if (cmd) {
        cmd.run();
        setOpen(false);
      }
    }
  }

  // group results preserving order
  const groups = useMemo(() => {
    const map = new Map<string, Cmd[]>();
    results.forEach((c) => {
      const arr = map.get(c.group) ?? [];
      arr.push(c);
      map.set(c.group, arr);
    });
    return [...map.entries()];
  }, [results]);

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center p-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="panel-highlight relative w-full max-w-xl overflow-hidden rounded-xl border border-hairline-strong bg-surface-2 shadow-overlay"
          >
            <div className="flex items-center gap-3 border-b border-hairline px-4">
              <Search className="size-4 text-ink-subtle" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search pages, organizations, actions…"
                className="h-12 w-full bg-transparent text-body text-ink placeholder:text-ink-tertiary focus:outline-none"
              />
              <kbd className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink-subtle">
                esc
              </kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <p className="px-3 py-8 text-center text-body-sm text-ink-subtle">
                  No matches found.
                </p>
              )}
              {groups.map(([group, items]) => (
                <div key={group} className="mb-1">
                  <p className="px-2.5 py-1.5 text-[0.6875rem] font-medium uppercase tracking-wide text-ink-tertiary">
                    {group}
                  </p>
                  {items.map((c) => {
                    flatIndex++;
                    const selected = flatIndex === cursor;
                    return (
                      <button
                        key={c.id}
                        onMouseEnter={() => setCursor(results.indexOf(c))}
                        onClick={() => {
                          c.run();
                          setOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-body-sm transition-colors",
                          selected ? "bg-surface-4 text-ink" : "text-ink-muted",
                        )}
                      >
                        <span className="text-ink-subtle">{c.icon}</span>
                        <span className="flex-1 truncate">{c.label}</span>
                        {selected ? (
                          <CornerDownLeft className="size-3.5 text-ink-tertiary" />
                        ) : (
                          <ArrowRight className="size-3.5 text-transparent" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
