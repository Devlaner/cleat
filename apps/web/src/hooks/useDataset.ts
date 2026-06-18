import { useEffect, useState } from "react";
import { fetchDataset } from "@/lib/api/dataset";
import type { Dataset } from "@cleat/contracts";
import { useOrgStore } from "@/stores/useOrgStore";

export function useDataset() {
  const accountId = useOrgStore((s) => s.activeAccountId);

  const [data, setData] = useState<Dataset | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!accountId) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);

    fetchDataset(accountId)
      .then((d) => {
        if (!cancelled) {
          setData(d);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setData(null);
          setError(err instanceof Error ? err : new Error("Unexpected error"));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [accountId]);

  return {
    data,
    error,
    loading,
  };
}
