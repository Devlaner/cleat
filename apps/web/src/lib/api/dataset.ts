import type { Dataset } from "@cleat/contracts";
import { getDataset } from "@/data";

const requestCache = new Map<string, Promise<Dataset>>();

export function fetchDataset(accountId: string): Promise<Dataset> {
  const cached = requestCache.get(accountId);

  if (cached) {
    return cached;
  }

  const request = (async () => {
    const useMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";

    if (useMockApi) {
      await new Promise((r) => setTimeout(r, 50));

      return getDataset(accountId);
    }

    const res = await fetch(`/api/dataset?accountId=${encodeURIComponent(accountId)}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch dataset: ${res.status} ${res.statusText}`);
    }

    return (await res.json()) as Dataset;
  })();

  requestCache.set(accountId, request);

  request.catch(() => {
    requestCache.delete(accountId);
  });

  return request;
}
