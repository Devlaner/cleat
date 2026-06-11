import { useEffect, useState } from "react";
import { fetchDataset } from "@/lib/api/dataset";
import type { Dataset } from "@cleat/contracts";
import { useOrgStore } from "@/stores/useOrgStore";

export function useDataset(): Dataset {
  const accountId = useOrgStore((s) => s.activeAccountId);
  const [data, setData] = useState<Dataset | null>(null);

  useEffect(() => {
    if (!accountId) return;

    fetchDataset(accountId).then(setData);
  }, [accountId]);

  if (!data) {
    throw new Promise(() => {});
  }

  return data;
}
