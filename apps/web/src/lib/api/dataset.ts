import { getDataset } from "@/data";
import type { Dataset } from "@cleat/contracts";

/**
 * Mock API layer for dataset.
 * Fully mimics real backend endpoint behavior.
 */
export async function fetchDataset(accountId: string): Promise<Dataset> {
  // MOCK MODE
  if (import.meta.env.VITE_USE_MOCK_API === "true") {
    await new Promise((r) => setTimeout(r, 50));
    return getDataset(accountId);
  }

  // REAL BACKEND
  const res = await fetch(`/api/dataset?accountId=${accountId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch dataset");
  }

  const data: Dataset = await res.json();
  return data;
}
