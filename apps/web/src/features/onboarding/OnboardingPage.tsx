import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowRight, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import { ACCOUNTS, getAccount } from "@/data/accounts";
import { useOrgStore } from "@/stores/useOrgStore";
import { ScanStep } from "./ScanStep";

type Step = "select" | "scan";

export function OnboardingPage() {
  const navigate = useNavigate();
  const connect = useOrgStore((s) => s.connect);
  const [step, setStep] = useState<Step>("select");
  const [selected, setSelected] = useState<string[]>(ACCOUNTS.map((a) => a.id));

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function startScan() {
    connect(selected);
    setStep("scan");
  }

  const personal = ACCOUNTS.filter((a) => a.type === "user");
  const orgs = ACCOUNTS.filter((a) => a.type === "org");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-canvas px-4 py-10">
      <div className="cleat-aurora absolute inset-0" />
      <div className="relative mb-8">
        <Logo size={30} />
      </div>

      {/* Stepper */}
      <div className="relative mb-8 flex items-center gap-3 text-caption">
        <StepDot n={1} label="Choose accounts" active={step === "select"} done={step === "scan"} />
        <div className="h-px w-10 bg-hairline" />
        <StepDot n={2} label="First scan" active={step === "scan"} done={false} />
      </div>

      <AnimatePresence mode="wait">
        {step === "select" ? (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-lg"
          >
            <Card className="p-8">
              <h1 className="text-center text-headline font-semibold text-ink">
                Choose what to monitor
              </h1>
              <p className="mt-2 text-center text-body-sm text-ink-subtle">
                Select the account and organizations Cleat should scan. You can change this anytime.
              </p>

              <Group icon={<User className="size-3" />} label="Personal">
                {personal.map((a) => (
                  <AccountRow
                    key={a.id}
                    id={a.id}
                    on={selected.includes(a.id)}
                    onToggle={() => toggle(a.id)}
                  />
                ))}
              </Group>
              <Group icon={<Building2 className="size-3" />} label="Organizations">
                {orgs.map((a) => (
                  <AccountRow
                    key={a.id}
                    id={a.id}
                    on={selected.includes(a.id)}
                    onToggle={() => toggle(a.id)}
                  />
                ))}
              </Group>

              <Button
                variant="primary"
                size="lg"
                className="mt-6 w-full"
                disabled={selected.length === 0}
                onClick={startScan}
              >
                Run first scan
                <ArrowRight className="size-4" />
              </Button>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="scan"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-lg"
          >
            <ScanStep accountIds={selected} onDone={() => navigate("/app/overview")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepDot({
  n,
  label,
  active,
  done,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div
      className={cn("flex items-center gap-2", active || done ? "text-ink" : "text-ink-tertiary")}
    >
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-full text-[0.625rem] font-semibold ring-1 ring-inset",
          done
            ? "bg-success/15 text-success ring-success/30"
            : active
              ? "bg-primary text-on-primary ring-transparent"
              : "bg-surface-2 text-ink-subtle ring-hairline",
        )}
      >
        {done ? <Check className="size-3" /> : n}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}

function Group({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <p className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-medium uppercase tracking-wide text-ink-tertiary">
        {icon}
        {label}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function AccountRow({ id, on, onToggle }: { id: string; on: boolean; onToggle: () => void }) {
  const a = getAccount(id);
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
        on ? "border-primary/40 bg-surface-2" : "border-hairline hover:bg-surface-1",
      )}
    >
      <Avatar seed={a.login} label={a.name} size={32} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-sm font-medium text-ink">{a.name}</p>
        <p className="truncate text-caption text-ink-subtle">
          @{a.login} · {a.repoCount} repos · {a.plan}
        </p>
      </div>
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          on ? "border-primary bg-primary text-on-primary" : "border-hairline-strong",
        )}
      >
        {on && <Check className="size-3.5" />}
      </span>
    </button>
  );
}
