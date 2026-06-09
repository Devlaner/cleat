import { useMemo } from "react";
import { getDataset } from "@/data";
import type { Dataset } from "@contracts/types";
import { useOrgStore } from "@/stores/useOrgStore";

/** The memoized dataset for the currently active account. */
export function useDataset(): Dataset {
  const accountId = useOrgStore((s) => s.activeAccountId);
  return useMemo(() => getDataset(accountId), [accountId]);
}
