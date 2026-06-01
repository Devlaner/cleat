import { getAccount } from "./accounts";
import { generateDataset } from "./generate";
import type { Dataset } from "./types";

const cache = new Map<string, Dataset>();

/** Memoized dataset for an account - generated once, stable thereafter. */
export function getDataset(accountId: string): Dataset {
  let ds = cache.get(accountId);
  if (!ds) {
    ds = generateDataset(getAccount(accountId));
    cache.set(accountId, ds);
  }
  return ds;
}

export type { Dataset } from "./types";
export * from "./accounts";
