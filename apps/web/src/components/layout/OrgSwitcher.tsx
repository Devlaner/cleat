import { Check, ChevronsUpDown, Plus, Building2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { Popover } from "@/components/ui/Popover";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { useConnectedAccounts, useOrgStore, useActiveAccount } from "@/stores/useOrgStore";
import type { Account } from "@contracts/types";

export function OrgSwitcher({ collapsed }: { collapsed?: boolean }) {
  const accounts = useConnectedAccounts();
  const active = useActiveAccount();
  const setActive = useOrgStore((s) => s.setActiveAccount);
  const navigate = useNavigate();

  const personal = accounts.filter((a) => a.type === "user");
  const orgs = accounts.filter((a) => a.type === "org");

  return (
    <Popover
      className="w-full"
      trigger={(open) => (
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-lg border border-transparent px-2 py-2 transition-colors hover:bg-surface-2",
            open && "bg-surface-2 border-hairline",
          )}
        >
          <Avatar seed={active.login} label={active.name} size={28} />
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-body-sm font-medium text-ink">{active.name}</p>
                <p className="truncate text-caption text-ink-subtle">
                  {active.type === "org" ? "Organization" : "Personal"} · {active.plan}
                </p>
              </div>
              <ChevronsUpDown className="size-4 shrink-0 text-ink-tertiary" />
            </>
          )}
        </div>
      )}
    >
      {(close) => (
        <div className="w-60">
          <AccountGroup label="Personal" icon={<User className="size-3" />}>
            {personal.map((a) => (
              <AccountRow
                key={a.id}
                account={a}
                active={a.id === active.id}
                onSelect={() => {
                  setActive(a.id);
                  close();
                }}
              />
            ))}
          </AccountGroup>
          {orgs.length > 0 && (
            <AccountGroup label="Organizations" icon={<Building2 className="size-3" />}>
              {orgs.map((a) => (
                <AccountRow
                  key={a.id}
                  account={a}
                  active={a.id === active.id}
                  onSelect={() => {
                    setActive(a.id);
                    close();
                  }}
                />
              ))}
            </AccountGroup>
          )}
          <div className="mt-1 border-t border-hairline pt-1">
            <button
              onClick={() => {
                navigate("/app/settings");
                close();
              }}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-body-sm text-ink-subtle transition-colors hover:bg-surface-3 hover:text-ink"
            >
              <Plus className="size-4" />
              Manage connections
            </button>
          </div>
        </div>
      )}
    </Popover>
  );
}

function AccountGroup({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-1">
      <p className="flex items-center gap-1.5 px-2.5 py-1.5 text-[0.6875rem] font-medium uppercase tracking-wide text-ink-tertiary">
        {icon}
        {label}
      </p>
      {children}
    </div>
  );
}

function AccountRow({
  account,
  active,
  onSelect,
}: {
  account: Account;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left transition-colors hover:bg-surface-3",
        active && "bg-surface-3",
      )}
    >
      <Avatar seed={account.login} label={account.name} size={24} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-sm text-ink">{account.name}</p>
        <p className="truncate text-caption text-ink-subtle">@{account.login}</p>
      </div>
      {account.plan === "Enterprise" && <Badge tone="primary">Ent</Badge>}
      {active && <Check className="size-4 shrink-0 text-primary-hover" />}
    </button>
  );
}
