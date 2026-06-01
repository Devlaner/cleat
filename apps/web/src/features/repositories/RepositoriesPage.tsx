import { useNavigate } from "react-router-dom";
import {
  FolderGit2,
  Lock,
  Globe,
  Building2,
  ShieldCheck,
  ShieldX,
  Star,
  Archive,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SummaryStats } from "@/components/ui/SummaryStats";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ScoreBar } from "@/components/ui/Meters";
import { useDataset } from "@/hooks/useDataset";
import { useFilteredRows, type FacetDef } from "@/hooks/useFilteredRows";
import { scoreToGrade, GRADE_COLOR } from "@/lib/severity";
import { languageColor } from "@/lib/ecosystems";
import { relativeTime, compactNumber, fromMb } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Repo, Visibility } from "@/data/types";

const TABLE = "repositories";

const VIS_ICON: Record<Visibility, typeof Lock> = {
  private: Lock,
  public: Globe,
  internal: Building2,
};

export function RepositoriesPage() {
  const ds = useDataset();
  const navigate = useNavigate();

  const protectedCount = ds.repos.filter((r) => r.branchProtected).length;
  const archived = ds.repos.filter((r) => r.archived).length;
  const avgHygiene = Math.round(
    ds.repos.reduce((s, r) => s + r.hygieneScore, 0) / Math.max(1, ds.repos.length),
  );

  const facets: FacetDef<Repo>[] = [
    {
      key: "visibility",
      label: "Visibility",
      accessor: (r) => r.visibility,
      options: [
        { value: "private", label: "Private" },
        { value: "public", label: "Public" },
        { value: "internal", label: "Internal" },
      ],
    },
    {
      key: "language",
      label: "Language",
      accessor: (r) => r.language,
      options: [...new Set(ds.repos.map((r) => r.language))]
        .sort()
        .map((l) => ({ value: l, label: l })),
    },
    {
      key: "protection",
      label: "Protection",
      accessor: (r) => (r.branchProtected ? "protected" : "unprotected"),
      options: [
        { value: "protected", label: "Protected" },
        { value: "unprotected", label: "Unprotected" },
      ],
    },
    {
      key: "grade",
      label: "Grade",
      accessor: (r) => scoreToGrade(r.hygieneScore),
      options: (["A", "B", "C", "D", "F"] as const).map((g) => ({ value: g, label: `Grade ${g}` })),
    },
  ];

  const rows = useFilteredRows(TABLE, ds.repos, {
    search: (r) => `${r.name} ${r.language} ${r.topics.join(" ")}`,
    facets,
  });

  const columns: Column<Repo>[] = [
    {
      id: "name",
      header: "Repository",
      sortValue: (r) => r.name,
      cell: (r) => {
        const Vis = VIS_ICON[r.visibility];
        return (
          <div className="flex items-center gap-2.5">
            <Vis className="size-4 shrink-0 text-ink-tertiary" />
            <div className="min-w-0">
              <p className="flex items-center gap-2 truncate font-medium text-ink">
                {r.name}
                {r.archived && <Archive className="size-3 text-ink-tertiary" />}
              </p>
              <p className="flex items-center gap-1.5 truncate text-caption text-ink-tertiary">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: languageColor(r.language) }}
                />
                {r.language}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "hygiene",
      header: "Hygiene",
      sortValue: (r) => r.hygieneScore,
      className: "w-32",
      cell: (r) => {
        const g = scoreToGrade(r.hygieneScore);
        return (
          <div className="flex items-center gap-2">
            <ScoreBar value={r.hygieneScore / 100} hex={GRADE_COLOR[g].hex} className="w-14" />
            <span className={cn("w-4 text-body-sm font-semibold", GRADE_COLOR[g].text)}>{g}</span>
          </div>
        );
      },
    },
    {
      id: "vulns",
      header: "Vulns",
      sortValue: (r) => r.openVulns,
      align: "right",
      hideBelow: "sm",
      cell: (r) => (
        <span
          className={cn("tabular-nums", r.openVulns > 0 ? "text-ink-muted" : "text-ink-tertiary")}
        >
          {r.openVulns}
        </span>
      ),
    },
    {
      id: "secrets",
      header: "Secrets",
      sortValue: (r) => r.openSecrets,
      align: "right",
      hideBelow: "md",
      cell: (r) => (
        <span
          className={cn("tabular-nums", r.openSecrets > 0 ? "text-critical" : "text-ink-tertiary")}
        >
          {r.openSecrets}
        </span>
      ),
    },
    {
      id: "protection",
      header: "Protection",
      sortValue: (r) => (r.branchProtected ? 1 : 0),
      hideBelow: "lg",
      cell: (r) =>
        r.branchProtected ? (
          <span className="inline-flex items-center gap-1.5 text-caption text-success">
            <ShieldCheck className="size-3.5" /> protected
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-caption text-high">
            <ShieldX className="size-3.5" /> open
          </span>
        ),
    },
    {
      id: "stars",
      header: "Stars",
      sortValue: (r) => r.stars,
      align: "right",
      hideBelow: "lg",
      cell: (r) => (
        <span className="inline-flex items-center gap-1 tabular-nums text-ink-subtle">
          <Star className="size-3" /> {compactNumber(r.stars)}
        </span>
      ),
    },
    {
      id: "size",
      header: "Size",
      sortValue: (r) => r.sizeMb,
      align: "right",
      hideBelow: "xl",
      cell: (r) => <span className="tabular-nums text-ink-subtle">{fromMb(r.sizeMb)}</span>,
    },
    {
      id: "lastPushedAt",
      header: "Last push",
      sortValue: (r) => r.lastPushedAt,
      align: "right",
      hideBelow: "md",
      cell: (r) => (
        <span className="text-caption text-ink-subtle">{relativeTime(r.lastPushedAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Maintenance"
        title="Repositories"
        description="Every repository's hygiene, protection and risk in one filterable inventory. Open a repo for its full scorecard."
      />

      <SummaryStats
        items={[
          {
            label: "Repositories",
            value: ds.repos.length,
            icon: <FolderGit2 className="size-3.5" />,
          },
          {
            label: "Branch protected",
            value: `${protectedCount}/${ds.repos.length}`,
            icon: <ShieldCheck className="size-3.5" />,
          },
          {
            label: "Avg hygiene",
            value: avgHygiene,
            tone: GRADE_COLOR[scoreToGrade(avgHygiene)].text,
          },
          { label: "Archived", value: archived, icon: <Archive className="size-3.5" /> },
        ]}
      />

      <FilterBar
        tableKey={TABLE}
        facets={facets}
        searchPlaceholder="Search repositories…"
        count={rows.length}
        total={ds.repos.length}
        noun="repos"
      />

      <DataTable
        tableKey={TABLE}
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        onRowClick={(r) => navigate(`/app/repositories/${r.id}`)}
        empty={{
          icon: FolderGit2,
          title: "No repositories match",
          description: "Adjust the filters above.",
        }}
      />
    </div>
  );
}
