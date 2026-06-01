import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  FolderGit2,
  Package,
  Workflow,
  KeyRound,
  Users,
  Check,
  Loader2,
  ShieldCheck,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Counter } from "@/components/ui/Counter";
import { getAccount } from "@/data/accounts";
import { cn } from "@/lib/cn";

interface Stage {
  icon: LucideIcon;
  label: string;
  target: number;
  unit: string;
}

export function ScanStep({ accountIds, onDone }: { accountIds: string[]; onDone: () => void }) {
  const repos = accountIds.reduce((s, id) => s + getAccount(id).repoCount, 0);
  const members = accountIds.reduce((s, id) => s + getAccount(id).memberCount, 0);

  const stages: Stage[] = [
    { icon: FolderGit2, label: "Scanning repositories", target: repos, unit: "repos" },
    { icon: Package, label: "Analyzing dependencies", target: repos * 47, unit: "packages" },
    {
      icon: Workflow,
      label: "Auditing Actions workflows",
      target: Math.round(repos * 1.6),
      unit: "workflows",
    },
    {
      icon: KeyRound,
      label: "Hunting for secrets",
      target: Math.round(repos * 0.2) + 3,
      unit: "exposures",
    },
    { icon: Users, label: "Reviewing access & members", target: members, unit: "identities" },
  ];

  const [index, setIndex] = useState(0);
  const done = index >= stages.length;

  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setIndex((i) => i + 1), index === 0 ? 600 : 850);
    return () => clearTimeout(t);
  }, [index, done]);

  const progress = Math.min(1, index / stages.length);

  return (
    <Card className="p-8">
      <div className="text-center">
        <motion.div
          className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-surface-2 ring-1 ring-inset ring-hairline"
          animate={done ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          {done ? (
            <ShieldCheck className="size-7 text-success" />
          ) : (
            <Loader2 className="size-7 animate-spin text-primary-hover" />
          )}
        </motion.div>
        <h1 className="mt-4 text-headline font-semibold text-ink">
          {done ? "Scan complete" : "Running your first scan"}
        </h1>
        <p className="mt-1.5 text-body-sm text-ink-subtle">
          {done
            ? "Here's what Cleat found across your account and organizations."
            : "Cleat is reading your repositories, dependencies and workflows…"}
        </p>
      </div>

      {/* progress */}
      <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-surface-3">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${(done ? 1 : progress) * 100}%` }}
          transition={{ ease: "easeOut", duration: 0.6 }}
        />
      </div>

      {/* stages */}
      <div className="mt-5 space-y-1.5">
        {stages.map((s, i) => {
          const active = i === index;
          const complete = i < index;
          return (
            <div
              key={s.label}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                active ? "bg-surface-2" : complete ? "" : "opacity-45",
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset",
                  complete
                    ? "bg-success/12 text-success ring-success/25"
                    : active
                      ? "bg-primary/12 text-primary-hover ring-primary/25"
                      : "bg-surface-2 text-ink-subtle ring-hairline",
                )}
              >
                {complete ? (
                  <Check className="size-3.5" />
                ) : active ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <s.icon className="size-3.5" />
                )}
              </span>
              <span className="flex-1 text-body-sm text-ink-muted">{s.label}</span>
              {complete && (
                <span className="text-caption tabular-nums text-ink-subtle">
                  <Counter value={s.target} duration={700} className="font-medium text-ink" />{" "}
                  {s.unit}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {done && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mt-6 grid grid-cols-3 gap-2.5">
            <Summary value={Math.round(repos * 0.2) + 3} label="Secrets" tone="text-critical" />
            <Summary value={Math.round(repos * 0.55)} label="Vulnerabilities" tone="text-high" />
            <Summary value={Math.round(repos * 1.6)} label="Workflows" tone="text-low" />
          </div>
          <Button variant="primary" size="lg" className="mt-6 w-full" onClick={onDone}>
            Enter Cleat
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      )}
    </Card>
  );
}

function Summary({ value, label, tone }: { value: number; label: string; tone: string }) {
  return (
    <div className="rounded-lg border border-hairline bg-surface-2 p-3 text-center">
      <p className={cn("text-card-title font-semibold tabular-nums", tone)}>
        <Counter value={value} duration={900} />
      </p>
      <p className="mt-0.5 text-caption text-ink-subtle">{label}</p>
    </div>
  );
}
