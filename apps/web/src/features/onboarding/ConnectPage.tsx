import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Loader2, Check, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LogoMark, Logo } from "@/components/ui/Logo";
import { GithubMark } from "@/components/ui/GithubMark";

const SCOPES = [
  { label: "Read access to code & metadata", detail: "Repositories, branches, commits" },
  { label: "Read dependency & security alerts", detail: "Dependabot, code scanning, secrets" },
  { label: "Read organization & members", detail: "Teams, roles, audit log" },
  { label: "Read Actions, artifacts & packages", detail: "Workflows, runs, storage usage" },
];

export function ConnectPage() {
  const navigate = useNavigate();
  const [authorizing, setAuthorizing] = useState(false);

  function authorize() {
    setAuthorizing(true);
    setTimeout(() => navigate("/onboarding"), 1100);
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-canvas px-4 py-10">
      <div className="cleat-aurora absolute inset-0" />
      <Link to="/" className="relative mb-8">
        <Logo size={30} />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <Card className="overflow-hidden">
          {/* OAuth header */}
          <div className="flex items-center justify-center gap-4 border-b border-hairline bg-surface-2 px-6 py-6">
            <div className="flex size-12 items-center justify-center rounded-xl bg-canvas ring-1 ring-hairline">
              <GithubMark size={26} />
            </div>
            <div className="flex items-center gap-1.5 text-ink-tertiary">
              <span className="size-1.5 rounded-full bg-hairline-tertiary" />
              <span className="size-1.5 rounded-full bg-hairline-tertiary" />
              <span className="size-1.5 rounded-full bg-primary" />
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-canvas ring-1 ring-hairline">
              <LogoMark size={26} />
            </div>
          </div>

          <div className="p-6">
            <h1 className="text-center text-card-title font-medium text-ink">Authorize Cleat</h1>
            <p className="mt-1.5 text-center text-body-sm text-ink-subtle">
              Cleat is requesting <span className="text-ink-muted">read-only</span> access to your
              GitHub account and organizations.
            </p>

            <div className="mt-6 space-y-1.5">
              {SCOPES.map((s) => (
                <div key={s.label} className="flex items-start gap-3 rounded-lg bg-surface-2 p-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/12 text-success ring-1 ring-inset ring-success/25">
                    <Check aria-hidden="true" className="size-3" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-body-sm text-ink">{s.label}</p>
                    <p className="text-caption text-ink-subtle">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="primary"
              size="lg"
              className="mt-6 w-full"
              aria-busy={authorizing}
              onClick={authorize}
              disabled={authorizing}
            >
              {authorizing ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Authorizing…
                </>
              ) : (
                <>
                  Authorize & continue
                  <ChevronRight aria-hidden="true" className="size-4" />
                </>
              )}
            </Button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-caption text-ink-tertiary">
              <Lock aria-hidden="true" className="size-3" />
              Read-only · no code is ever modified · revoke anytime
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
