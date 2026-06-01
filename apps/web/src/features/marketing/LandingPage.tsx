import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { KeyRound, ShieldAlert, Workflow, Archive, Users, Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MarketingNav } from "./MarketingNav";
import { MarketingFooter } from "./MarketingFooter";
import { cn } from "@/lib/cn";
import type { PreviewScreen } from "./ProductPreview";

// The product preview pulls in charts, so it loads lazily to keep the landing light.
const ProductPreview = lazy(() =>
  import("./ProductPreview").then((m) => ({ default: m.ProductPreview })),
);

function PreviewBlock({ screen = "overview" }: { screen?: PreviewScreen }) {
  return (
    <Suspense
      fallback={
        <div className="panel-highlight aspect-[1240/820] w-full overflow-hidden rounded-xl border border-hairline-strong bg-surface-1">
          <div className="h-full w-full animate-pulse bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.03),transparent)]" />
        </div>
      }
    >
      <ProductPreview screen={screen} />
    </Suspense>
  );
}

function Showcase({
  eyebrow,
  title,
  subtitle,
  screen,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  screen: PreviewScreen;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6">
      <SectionHead eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="mt-12">
        <PreviewBlock screen={screen} />
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: KeyRound,
    title: "Secret scanning",
    body: "Catch leaked API keys, tokens and credentials across full history, with live validity checks so you fix what's actually exploitable.",
  },
  {
    icon: ShieldAlert,
    title: "Smart vulnerabilities",
    body: "Vulnerable dependencies ranked by severity, EPSS exploit probability, KEV status and reachability, not just raw alert volume.",
  },
  {
    icon: Workflow,
    title: "Supply-chain audit",
    body: "Find unpinned GitHub Actions, over-broad workflow permissions and risky third-party actions before the next tj-actions.",
  },
  {
    icon: Archive,
    title: "Cost & artifacts",
    body: "Reclaim storage spend from forgotten build artifacts, stale caches and untagged packages. See what you can delete today.",
  },
  {
    icon: Users,
    title: "Access & audit",
    body: "Review members, 2FA, outside collaborators, OAuth apps, webhooks and keys, with a full audit-log activity stream.",
  },
  {
    icon: Bell,
    title: "Critical alerts",
    body: "Get notified the moment something dangerous happens: a new admin, a disabled branch protection, a repo gone public.",
  },
];

const STATS = [
  { value: "2.4M", label: "dependencies scanned" },
  { value: "180K", label: "secrets caught" },
  { value: "$3.2M", label: "storage reclaimed" },
  { value: "12K", label: "repos monitored" },
];

const TIERS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    features: [
      "Personal account",
      "Up to 5 repositories",
      "Weekly security scans",
      "Core secret & vuln alerts",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Team",
    price: "$12",
    cadence: "per user / month",
    features: [
      "Unlimited repositories",
      "Daily scans + supply-chain audit",
      "Artifact & cost insights",
      "Audit log + critical alerts",
      "Up to 3 organizations",
    ],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "annual",
    features: [
      "SSO / SAML & SCIM",
      "Custom security policies",
      "Priority SLA & support",
      "Unlimited organizations",
    ],
    cta: "Contact sales",
    featured: false,
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="cleat-aurora absolute inset-0" />
        <div className="cleat-grid absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-36 text-center sm:px-6 sm:pt-40">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-4xl text-display-md font-semibold text-ink sm:text-display-lg lg:text-display-xl"
          >
            Secure every corner of your GitHub
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-5 max-w-2xl text-body-lg text-ink-muted"
          >
            Cleat connects to your account and organizations to surface leaked secrets, vulnerable
            dependencies, risky workflows and reclaimable spend, then alerts you the moment
            something critical happens.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/connect">
              <Button variant="primary" size="lg">
                Connect GitHub for free
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg">
                See how it works
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto mt-16"
          >
            <PreviewBlock />
          </motion.div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="border-y border-hairline bg-canvas py-10">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-caption uppercase tracking-wide text-ink-tertiary">
            Trusted by security-minded teams
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
            {["Aurora Labs", "Northwind", "Helios Systems", "Vertex", "Lumen", "Cobalt"].map(
              (name) => (
                <span key={name} className="text-body font-semibold tracking-tight text-ink-subtle">
                  {name}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-24 sm:px-6">
        <SectionHead
          eyebrow="One platform"
          title="Everything you need to keep GitHub healthy"
          subtitle="Security, supply-chain, maintenance and governance, unified across every repo and organization you own."
        />
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="animate-rise"
              style={{ animationDelay: `${(i % 3) * 70}ms` }}
            >
              <Card className="group h-full p-6 transition-colors hover:border-hairline-strong">
                <div className="flex size-10 items-center justify-center rounded-lg bg-surface-2 text-primary-hover ring-1 ring-inset ring-hairline transition-colors group-hover:bg-surface-3">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-card-title font-medium text-ink">{f.title}</h3>
                <p className="mt-2 text-body-sm text-ink-subtle">{f.body}</p>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase: prioritization */}
      <Showcase
        eyebrow="Prioritization"
        title="Fix what's actually exploitable first"
        subtitle="Cleat blends CVSS severity with EPSS exploit probability, KEV status and reachability, so the top of the list is always the work that matters most."
        screen="vulnerabilities"
      />

      {/* Showcase: supply chain */}
      <Showcase
        eyebrow="Supply chain"
        title="Harden your CI/CD before the next incident"
        subtitle="Catch unpinned actions, over-broad workflow permissions and live supply-chain bulletins across every repository you own."
        screen="supply-chain"
      />

      {/* Stats */}
      <section className="border-y border-hairline bg-canvas">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-hairline sm:grid-cols-4 sm:divide-y-0">
          {STATS.map((s) => (
            <div key={s.label} className="px-6 py-12 text-center">
              <p className="text-display-md font-semibold tracking-tight text-ink">{s.value}</p>
              <p className="mt-1 text-caption text-ink-subtle">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase: cost */}
      <Showcase
        eyebrow="Cost control"
        title="Reclaim spend you forgot you were paying"
        subtitle="Surface forgotten build artifacts, stale caches and untagged packages, then forecast your bill before it grows."
        screen="artifacts"
      />

      {/* Trust section */}
      <section id="trust" className="mx-auto max-w-7xl px-5 py-24 sm:px-6">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-2">
          <div>
            <p className="text-eyebrow uppercase text-primary-hover">Built for trust</p>
            <h2 className="mt-3 text-display-md font-semibold text-ink">
              Read-only by default. Revoke anytime.
            </h2>
            <p className="mt-4 max-w-xl text-body text-ink-muted">
              Cleat requests the minimum scopes needed to scan. We never write to your code, and you
              can disconnect any organization in one click. Findings are prioritized so you fix what
              matters first, not chase noise.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              "Minimal, read-only GitHub scopes",
              "EPSS + KEV + reachability prioritization",
              "Full audit trail of every critical change",
              "No code leaves your control",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-body-sm text-ink-muted">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success/12 text-success ring-1 ring-inset ring-success/25">
                  <Check className="size-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-5 py-24 sm:px-6">
        <SectionHead
          eyebrow="Pricing"
          title="Start free, scale when you're ready"
          subtitle="Every plan includes core security scanning. Upgrade for supply-chain audit, cost insights and governance."
        />
        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {TIERS.map((t) => (
            <Card
              key={t.name}
              raised={t.featured}
              className={cn("relative flex flex-col p-6", t.featured && "ring-1 ring-primary/30")}
            >
              {t.featured && (
                <div className="absolute -top-3 left-6">
                  <Badge tone="primary" dot>
                    Most popular
                  </Badge>
                </div>
              )}
              <h3 className="text-headline font-semibold text-ink">{t.name}</h3>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-display-md font-semibold text-ink">{t.price}</span>
                <span className="text-caption text-ink-subtle">{t.cadence}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-body-sm text-ink-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary-hover" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/connect" className="mt-6">
                <Button variant={t.featured ? "primary" : "secondary"} className="w-full">
                  {t.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-6">
        <Card className="relative overflow-hidden p-12 text-center sm:p-16">
          <div className="cleat-aurora absolute inset-0 opacity-70" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-display-md font-semibold text-ink">
              See what's lurking in your GitHub
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-body text-ink-muted">
              Connect in seconds. Cleat runs your first scan immediately. No credit card required.
            </p>
            <Link to="/connect" className="mt-8 inline-block">
              <Button variant="primary" size="lg">
                Connect GitHub
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      <MarketingFooter />
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-eyebrow uppercase text-primary-hover">{eyebrow}</p>
      <h2 className="mt-3 text-display-md font-semibold text-ink">{title}</h2>
      <p className="mt-4 text-body text-ink-muted">{subtitle}</p>
    </div>
  );
}
