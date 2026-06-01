import { useState } from "react";
import { Ban, RefreshCw, Eraser, ShieldCheck, FileWarning } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { SeverityBadge } from "@/components/ui/Badge";
import { StatusPill } from "@/components/ui/StatusPill";
import { MonoChip } from "@/components/ui/Chip";
import { provider } from "@/lib/ecosystems";
import { relativeTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/stores/useUiStore";
import type { SecretFinding } from "@/data/types";

const STEPS = [
  { icon: Ban, title: "Revoke the credential", body: "Invalidate the leaked key at the provider so it can no longer be used." },
  { icon: RefreshCw, title: "Rotate & re-deploy", body: "Issue a fresh secret, store it in a secrets manager, and update consumers." },
  { icon: Eraser, title: "Purge from history", body: "Remove the secret from git history with git filter-repo, then force-push." },
];

export function SecretDetail({ secret, onClose }: { secret: SecretFinding | null; onClose: () => void }) {
  const addToast = useUiStore((s) => s.addToast);
  const [checked, setChecked] = useState<number[]>([]);

  const toggle = (i: number) => setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));
  const meta = secret ? provider(secret.provider) : null;

  return (
    <Drawer
      open={!!secret}
      onClose={() => { setChecked([]); onClose(); }}
      title={secret?.secretType ?? ""}
      description={secret ? `Detected ${relativeTime(secret.detectedAt)} by ${secret.author}` : undefined}
      footer={
        secret && (
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              addToast({ title: "Secret marked as resolved", description: `${secret.secretType} in ${secret.repo}`, variant: "success" });
              setChecked([]);
              onClose();
            }}
          >
            <ShieldCheck className="size-4" /> Mark as resolved
          </Button>
        )
      }
    >
      {secret && meta && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <MonoChip short={meta.short} hex={meta.hex} />
            <SeverityBadge severity={secret.severity} />
            <StatusPill tone={secret.validity === "active" ? "danger" : secret.validity === "revoked" ? "neutral" : "warning"} pulse={secret.validity === "active"}>
              {secret.validity === "active" ? "Active · exploitable now" : secret.validity === "revoked" ? "Revoked" : "Validity unknown"}
            </StatusPill>
            {secret.pushProtectionBlocked && <StatusPill tone="info">Push protection triggered</StatusPill>}
          </div>

          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline">
            <Row label="Repository" value={secret.repo} mono />
            <Row label="Location" value={`${secret.file}:${secret.line}`} mono />
            <Row label="Commit" value={secret.commit} mono />
            <Row label="Provider" value={meta.label} />
          </dl>

          {secret.validity === "active" && (
            <div className="flex items-start gap-2.5 rounded-lg border border-critical/25 bg-critical/8 p-3">
              <FileWarning className="mt-0.5 size-4 shrink-0 text-critical" />
              <p className="text-caption text-ink-muted">
                This credential is still <span className="text-critical">live</span>. Treat it as compromised and rotate immediately.
              </p>
            </div>
          )}

          <div>
            <p className="mb-2 text-caption font-medium uppercase tracking-wide text-ink-tertiary">Remediation</p>
            <div className="space-y-2">
              {STEPS.map((step, i) => {
                const on = checked.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggle(i)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                      on ? "border-success/30 bg-success/8" : "border-hairline bg-surface-2 hover:border-hairline-strong",
                    )}
                  >
                    <span className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md ring-1 ring-inset", on ? "bg-success/15 text-success ring-success/30" : "bg-surface-3 text-ink-subtle ring-hairline")}>
                      {on ? <ShieldCheck className="size-3.5" /> : <step.icon className="size-3.5" />}
                    </span>
                    <div className="min-w-0">
                      <p className={cn("text-body-sm font-medium", on ? "text-ink line-through decoration-ink-tertiary" : "text-ink")}>{step.title}</p>
                      <p className="mt-0.5 text-caption text-ink-subtle">{step.body}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-surface-1 px-3 py-2">
      <dt className="text-caption text-ink-subtle">{label}</dt>
      <dd className={cn("min-w-0 truncate text-body-sm text-ink", mono && "font-mono text-[0.8125rem]")}>{value}</dd>
    </div>
  );
}
