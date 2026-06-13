import { useEffect, useState } from "react";
import { fetchDataset } from "@/lib/api/dataset";
import type { Dataset } from "@cleat/contracts";
import { useOrgStore } from "@/stores/useOrgStore";

export function useDataset(): Dataset | null {
  const accountId = useOrgStore((s) => s.activeAccountId);
  const [data, setData] = useState<Dataset | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!accountId) {
      setData(null);
      return;
    }

    setData(null);

    fetchDataset(accountId).then((d) => {
      if (!cancelled) setData(d);
    });

    return () => {
      cancelled = true;
    };
  }, [accountId]);

  return data;
}
