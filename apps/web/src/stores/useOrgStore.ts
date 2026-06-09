import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ACCOUNTS, DEFAULT_ACCOUNT_ID, getAccount } from "@/data/accounts";
import type { Account } from "@contracts/types";

interface OrgState {
  /** simulated GitHub connection (set during onboarding) */
  connected: boolean;
  /** account ids the user chose to monitor */
  connectedAccountIds: string[];
  /** currently focused account/org */
  activeAccountId: string;

  connect: (accountIds: string[]) => void;
  disconnect: () => void;
  setActiveAccount: (id: string) => void;
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      connected: false,
      connectedAccountIds: [],
      activeAccountId: DEFAULT_ACCOUNT_ID,

      connect: (accountIds) =>
        set({
          connected: true,
          connectedAccountIds: accountIds,
          activeAccountId: accountIds[0] ?? DEFAULT_ACCOUNT_ID,
        }),
      disconnect: () =>
        set({
          connected: false,
          connectedAccountIds: [],
          activeAccountId: DEFAULT_ACCOUNT_ID,
        }),
      setActiveAccount: (id) => set({ activeAccountId: id }),
    }),
    { name: "cleat-org" },
  ),
);

/** The full list of connected accounts (falls back to all when none chosen). */
export function useConnectedAccounts(): Account[] {
  const ids = useOrgStore((s) => s.connectedAccountIds);
  if (ids.length === 0) return ACCOUNTS;
  return ids.map(getAccount);
}

/** The active account object. */
export function useActiveAccount(): Account {
  const id = useOrgStore((s) => s.activeAccountId);
  return getAccount(id);
}
