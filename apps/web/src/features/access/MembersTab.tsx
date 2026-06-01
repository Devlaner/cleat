import { ShieldCheck, ShieldX, UserCog } from "lucide-react";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useFilteredRows, type FacetDef } from "@/hooks/useFilteredRows";
import { relativeTime, pluralize } from "@/lib/format";
import type { Member } from "@/data/types";

const TABLE = "access-members";

const ROLE_TONE = { owner: "primary", admin: "warning", member: "neutral" } as const;

export function MembersTab({ members }: { members: Member[] }) {
  const facets: FacetDef<Member>[] = [
    {
      key: "role",
      label: "Role",
      accessor: (r) => r.role,
      options: [
        { value: "owner", label: "Owner" },
        { value: "admin", label: "Admin" },
        { value: "member", label: "Member" },
      ],
    },
    {
      key: "twoFactor",
      label: "2FA",
      accessor: (r) => (r.twoFactor ? "on" : "off"),
      options: [
        { value: "on", label: "2FA enabled" },
        { value: "off", label: "2FA missing" },
      ],
    },
    {
      key: "outside",
      label: "Type",
      accessor: (r) => (r.outsideCollaborator ? "outside" : "member"),
      options: [
        { value: "member", label: "Member" },
        { value: "outside", label: "Outside collaborator" },
      ],
    },
  ];

  const rows = useFilteredRows(TABLE, members, {
    search: (r) => `${r.name} ${r.login} ${r.teams.join(" ")}`,
    facets,
  });

  const columns: Column<Member>[] = [
    {
      id: "name",
      header: "Member",
      sortValue: (r) => r.name,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <Avatar seed={r.login} label={r.name} size={28} rounded="full" />
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{r.name}</p>
            <p className="truncate text-caption text-ink-tertiary">@{r.login}</p>
          </div>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      sortValue: (r) => r.role,
      cell: (r) => (
        <Badge tone={ROLE_TONE[r.role]}>
          {r.role}
          {r.outsideCollaborator ? " · outside" : ""}
        </Badge>
      ),
    },
    {
      id: "twoFactor",
      header: "2FA",
      sortValue: (r) => (r.twoFactor ? 1 : 0),
      cell: (r) =>
        r.twoFactor ? (
          <span className="inline-flex items-center gap-1.5 text-caption text-success">
            <ShieldCheck className="size-3.5" /> enabled
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-caption text-critical">
            <ShieldX className="size-3.5" /> missing
          </span>
        ),
    },
    {
      id: "teams",
      header: "Teams",
      hideBelow: "lg",
      cell: (r) =>
        r.teams.length ? (
          <div className="flex flex-wrap gap-1">
            {r.teams.map((t) => (
              <Badge key={t} tone="muted">
                {t}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-caption text-ink-tertiary">None</span>
        ),
    },
    {
      id: "repoAccess",
      header: "Repo access",
      sortValue: (r) => r.repoAccess,
      align: "right",
      hideBelow: "md",
      cell: (r) => <span className="tabular-nums text-ink-muted">{r.repoAccess}</span>,
    },
    {
      id: "lastActiveAt",
      header: "Last active",
      sortValue: (r) => r.lastActiveAt,
      align: "right",
      hideBelow: "sm",
      cell: (r) => (
        <span className="text-caption text-ink-subtle">{relativeTime(r.lastActiveAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <FilterBar
        tableKey={TABLE}
        facets={facets}
        searchPlaceholder="Search members…"
        count={rows.length}
        total={members.length}
        noun="members"
      />
      <DataTable
        tableKey={TABLE}
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        empty={{
          icon: UserCog,
          title: "No members match",
          description: "Adjust the filters above.",
        }}
      />
      <p className="text-caption text-ink-tertiary">
        {pluralize(members.filter((m) => !m.twoFactor).length, "member")} without 2FA ·{" "}
        {pluralize(members.filter((m) => m.outsideCollaborator).length, "outside collaborator")}.
      </p>
    </div>
  );
}
