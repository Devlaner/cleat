import { useState } from "react";
import {
  Workflow,
  PinOff,
  Unlock,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SummaryStats } from "@/components/ui/SummaryStats";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { Badge, SeverityBadge } from "@/components/ui/Badge";
import { WorkflowDetail } from "./WorkflowDetail";
import { useDataset } from "@/hooks/useDataset";
import { useFilteredRows, type FacetDef } from "@/hooks/useFilteredRows";
import { unpinnedActionCount } from "@/data/metrics";
import { percent } from "@/lib/format";
import { useUiStore } from "@/stores/useUiStore";
import type { WorkflowAudit, SupplyChainIncident } from "@cleat/contracts";
import { TailSpin } from "react-loader-spinner";

const TABLE = "workflows";

function riskTone(score: number) {
  if (score >= 60) return { sev: "critical" as const, label: "Critical" };
  if (score >= 35) return { sev: "high" as const, label: "High" };
  if (score >= 15) return { sev: "medium" as const, label: "Medium" };
  return { sev: "low" as const, label: "Low" };
}

export function SupplyChainPage() {
  const ds = useDataset();

  const [selected, setSelected] = useState<WorkflowAudit | null>(null);
  const facets: FacetDef<WorkflowAudit>[] = [
    {
      key: "permissions",
      label: "Permissions",
      accessor: (r) => r.permissions,
      options: [
        { value: "broad", label: "Broad" },
        { value: "scoped", label: "Scoped" },
      ],
    },
    {
      key: "oidc",
      label: "OIDC",
      accessor: (r) => (r.usesOidc ? "yes" : "no"),
      options: [
        { value: "yes", label: "Uses OIDC" },
        { value: "no", label: "Static secrets" },
      ],
    },
    {
      key: "pinned",
      label: "Pinning",
      accessor: (r) => (r.actions.some((a) => !a.pinned) ? "unpinned" : "pinned"),
      options: [
        { value: "unpinned", label: "Has unpinned" },
        { value: "pinned", label: "Fully pinned" },
      ],
    },
  ];

  const rows = useFilteredRows(TABLE, ds?.workflows ?? [], {
    search: (r) => `${r.repo} ${r.workflow} ${r.actions.map((a) => a.name).join(" ")}`,
    facets,
  });
  if (!ds) {
    return (
      <div className="space-y-5">
        <PageHeader eyebrow="Supply chain" title="Actions audit" description="Loading data..." />

        <div className="flex h-[300px] items-center justify-center">
          <TailSpin height="60" width="60" color="#5e6ad2" />
        </div>
      </div>
    );
  }
  const unpinned = unpinnedActionCount(ds);
  const broad = ds.workflows.filter((w) => w.permissions === "broad").length;
  const oidc = ds.workflows.length
    ? ds.workflows.filter((w) => w.usesOidc).length / ds.workflows.length
    : 0;

  const columns: Column<WorkflowAudit>[] = [
    {
      id: "workflow",
      header: "Workflow",
      sortValue: (r) => r.repo,
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
      hideBelow: "sm",
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
      id: "permissions",
      header: "Token",
      sortValue: (r) => r.permissions,
      hideBelow: "md",
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
      sortValue: (r) => (r.usesOidc ? 1 : 0),
      hideBelow: "lg",
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
      sortValue: (r) => r.riskScore,
      align: "right",
      cell: (r) => {
        const t = riskTone(r.riskScore);
        return <SeverityBadge severity={t.sev} showDot={false} />;
      },
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Supply chain"
        title="Actions audit"
        description="Harden your CI: pin third-party actions to commit SHAs, scope workflow permissions and prefer OIDC over static secrets."
      />

      {/* Incident bulletins */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <ShieldAlert className="size-4 text-high" />
          <h2 className="text-body-sm font-medium text-ink">Supply-chain bulletins</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {ds.incidents.map((inc) => (
            <IncidentCard key={inc.id} incident={inc} />
          ))}
        </div>
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
            tone: unpinned > 0 ? "text-high" : "text-success",
            icon: <PinOff className="size-3.5" />,
          },
          {
            label: "Broad permissions",
            value: broad,
            tone: broad > 0 ? "text-high" : undefined,
            icon: <Unlock className="size-3.5" />,
          },
          { label: "OIDC adoption", value: percent(oidc), icon: <KeyRound className="size-3.5" /> },
        ]}
      />

      <FilterBar
        tableKey={TABLE}
        facets={facets}
        searchPlaceholder="Search workflows, repos, actions…"
        count={rows.length}
        total={ds.workflows.length}
        noun="workflows"
      />

      <DataTable
        tableKey={TABLE}
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        onRowClick={setSelected}
        empty={{
          icon: ShieldCheck,
          title: "No workflows match",
          description: "Adjust filters to see more.",
        }}
      />

      <WorkflowDetail workflow={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function IncidentCard({ incident }: { incident: SupplyChainIncident }) {
  const addToast = useUiStore((s) => s.addToast);
  const statusTone =
    incident.status === "action-required"
      ? "danger"
      : incident.status === "monitoring"
        ? "warning"
        : "success";
  const statusLabel =
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
          <Badge tone={statusTone} dot>
            {statusLabel}
          </Badge>
        </div>
        <span className="font-mono text-caption text-ink-tertiary">{incident.cve}</span>
      </div>
      <h3 className="mt-2.5 text-body-sm font-medium text-ink">{incident.title}</h3>
      <p className="mt-1 flex-1 text-caption text-ink-subtle">{incident.summary}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-caption text-ink-tertiary">{incident.affectedAction}</span>
        <button
          onClick={() =>
            addToast({
              title: "Mitigation guide opened",
              description: incident.title,
              variant: "info",
            })
          }
          className="flex items-center gap-1 text-caption font-medium text-primary-hover transition-colors hover:text-primary"
        >
          {incident.affectedReposCount} repos affected <ArrowRight className="size-3" />
        </button>
      </div>
    </Card>
  );
}
