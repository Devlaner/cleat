import {
  Workflow,
  PinOff,
  Unlock,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge, SeverityBadge } from "@/components/ui/Badge";
import { SummaryStats } from "@/components/ui/SummaryStats";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { unpinnedActionCount } from "@/data/metrics";
import { percent } from "@/lib/format";
import { PreviewHeader } from "./previewChrome";
import type { Dataset, WorkflowAudit, SupplyChainIncident } from "@cleat/contracts";

function riskSev(score: number) {
  return score >= 60 ? "critical" : score >= 35 ? "high" : score >= 15 ? "medium" : "low";
}

export function SupplyChainPreview({ ds }: { ds: Dataset }) {
  const unpinned = unpinnedActionCount(ds);
  const broad = ds.workflows.filter((w) => w.permissions === "broad").length;
  const oidc = ds.workflows.length
    ? ds.workflows.filter((w) => w.usesOidc).length / ds.workflows.length
    : 0;
  const rows = [...ds.workflows].sort((a, b) => b.riskScore - a.riskScore).slice(0, 6);

  const columns: Column<WorkflowAudit>[] = [
    {
      id: "workflow",
      header: "Workflow",
      cell: (r) => (
        <div className="min-w-0">
          <p className="truncate font-mono text-[0.8125rem] text-ink">{r.repo}</p>
          <p className="truncate font-mono text-caption text-ink-tertiary">{r.workflow}</p>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (r) => {
        const u = r.actions.filter((a) => !a.pinned).length;
        return u > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-caption text-high">
            <PinOff className="size-3.5" /> {u} unpinned
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-caption text-success">
            <ShieldCheck className="size-3.5" /> pinned
          </span>
        );
      },
    },
    {
      id: "token",
      header: "Token",
      cell: (r) =>
        r.permissions === "broad" ? (
          <span className="inline-flex items-center gap-1.5 text-caption text-high">
            <Unlock className="size-3.5" /> broad
          </span>
        ) : (
          <span className="text-caption text-ink-subtle">scoped</span>
        ),
    },
    {
      id: "oidc",
      header: "Cloud auth",
      cell: (r) =>
        r.usesOidc ? (
          <Badge tone="success" dot>
            OIDC
          </Badge>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-caption text-ink-subtle">
            <KeyRound className="size-3" /> secrets
          </span>
        ),
    },
    {
      id: "risk",
      header: "Risk",
      align: "right",
      cell: (r) => <SeverityBadge severity={riskSev(r.riskScore)} showDot={false} />,
    },
  ];

  return (
    <div className="space-y-5 bg-canvas p-6">
      <PreviewHeader
        eyebrow="Supply chain"
        title="Actions audit"
        description="Pin third-party actions to commit SHAs, scope workflow permissions and prefer OIDC over static secrets."
      />
      <div className="grid grid-cols-2 gap-3">
        {ds.incidents.slice(0, 2).map((inc) => (
          <Bulletin key={inc.id} incident={inc} />
        ))}
      </div>
      <SummaryStats
        items={[
          {
            label: "Workflows audited",
            value: ds.workflows.length,
            icon: <Workflow className="size-3.5" />,
          },
          {
            label: "Unpinned actions",
            value: unpinned,
            tone: unpinned ? "text-high" : "text-success",
            icon: <PinOff className="size-3.5" />,
          },
          {
            label: "Broad permissions",
            value: broad,
            tone: broad ? "text-high" : undefined,
            icon: <Unlock className="size-3.5" />,
          },
          { label: "OIDC adoption", value: percent(oidc), icon: <KeyRound className="size-3.5" /> },
        ]}
      />
      <DataTable tableKey="pv-workflows" columns={columns} rows={rows} getRowId={(r) => r.id} />
    </div>
  );
}

function Bulletin({ incident }: { incident: SupplyChainIncident }) {
  const tone =
    incident.status === "action-required"
      ? "danger"
      : incident.status === "monitoring"
        ? "warning"
        : "success";
  const label =
    incident.status === "action-required"
      ? "Action required"
      : incident.status === "monitoring"
        ? "Monitoring"
        : "Resolved";
  return (
    <Card className="flex flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <SeverityBadge severity={incident.severity} />
          <Badge tone={tone} dot>
            {label}
          </Badge>
        </div>
        <span className="font-mono text-caption text-ink-tertiary">{incident.cve}</span>
      </div>
      <h3 className="mt-2.5 flex items-center gap-1.5 text-body-sm font-medium text-ink">
        <ShieldAlert className="size-3.5 text-high" /> {incident.title}
      </h3>
      <p className="mt-1 flex-1 text-caption text-ink-subtle">{incident.summary}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-caption font-medium text-primary-hover">
        {incident.affectedReposCount} repos affected <ArrowRight className="size-3" />
      </span>
    </Card>
  );
}
