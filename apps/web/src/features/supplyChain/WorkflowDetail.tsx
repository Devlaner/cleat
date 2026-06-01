import { Pin, PinOff, ShieldCheck, KeyRound, Lock, Unlock } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { relativeTime } from "@/lib/format";
import { useUiStore } from "@/stores/useUiStore";
import type { WorkflowAudit } from "@/data/types";

export function WorkflowDetail({ workflow, onClose }: { workflow: WorkflowAudit | null; onClose: () => void }) {
  const addToast = useUiStore((s) => s.addToast);
  const unpinned = workflow?.actions.filter((a) => !a.pinned).length ?? 0;

  return (
    <Drawer
      open={!!workflow}
      onClose={onClose}
      width={520}
      title={workflow?.workflow ?? ""}
      description={workflow ? `${workflow.repo} · ${workflow.runsPerWeek} runs/week · last run ${relativeTime(workflow.lastRunAt)}` : undefined}
      footer={
        workflow &&
        unpinned > 0 && (
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              addToast({ title: "Pin-to-SHA PR opened", description: `Pinning ${unpinned} action${unpinned > 1 ? "s" : ""} in ${workflow.workflow}`, variant: "success" });
              onClose();
            }}
          >
            <Pin className="size-4" /> Pin {unpinned} action{unpinned > 1 ? "s" : ""} to commit SHA
          </Button>
        )
      }
    >
      {workflow && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-2">
            <Posture
              ok={workflow.permissions === "scoped"}
              okIcon={<Lock className="size-3.5" />}
              badIcon={<Unlock className="size-3.5" />}
              label="Token permissions"
              okText="Scoped"
              badText="Broad (write-all)"
            />
            <Posture
              ok={workflow.usesOidc}
              okIcon={<KeyRound className="size-3.5" />}
              badIcon={<KeyRound className="size-3.5" />}
              label="Cloud auth"
              okText="OIDC"
              badText="Static secrets"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-caption font-medium uppercase tracking-wide text-ink-tertiary">
                Actions ({workflow.actions.length})
              </p>
              {unpinned > 0 && <Badge tone="warning">{unpinned} unpinned</Badge>}
            </div>
            <div className="space-y-2">
              {workflow.actions.map((a, i) => (
                <div key={i} className={cn("rounded-lg border p-3", a.pinned ? "border-hairline bg-surface-2" : "border-high/25 bg-high/[0.06]")}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 font-mono text-body-sm text-ink">
                      {a.pinned ? <Pin className="size-3.5 text-success" /> : <PinOff className="size-3.5 text-high" />}
                      {a.name}
                    </span>
                    {a.popular && <Badge tone="neutral">popular</Badge>}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 font-mono text-caption">
                    <span className={cn(a.pinned ? "text-success" : "text-high")}>
                      {a.name}@{a.pinned ? `${a.ref.slice(0, 12)}…` : a.ref}
                    </span>
                  </div>
                  {!a.pinned && (
                    <p className="mt-1.5 font-mono text-caption text-ink-tertiary">
                      → recommend @{a.recommendedSha.slice(0, 12)}…
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {unpinned === 0 && (
            <div className="flex items-center gap-2.5 rounded-lg border border-success/25 bg-success/8 p-3">
              <ShieldCheck className="size-4 shrink-0 text-success" />
              <p className="text-caption text-ink-muted">All actions are pinned to immutable commit SHAs.</p>
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}

function Posture({ ok, okIcon, badIcon, label, okText, badText }: { ok: boolean; okIcon: React.ReactNode; badIcon: React.ReactNode; label: string; okText: string; badText: string }) {
  return (
    <div className={cn("rounded-lg border p-3", ok ? "border-hairline bg-surface-2" : "border-high/25 bg-high/[0.06]")}>
      <p className="text-caption text-ink-subtle">{label}</p>
      <p className={cn("mt-1 flex items-center gap-1.5 text-body-sm font-medium", ok ? "text-success" : "text-high")}>
        {ok ? okIcon : badIcon}
        {ok ? okText : badText}
      </p>
    </div>
  );
}
