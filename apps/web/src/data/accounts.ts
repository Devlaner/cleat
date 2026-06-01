import type { Account } from "./types";

/**
 * The connected account + organizations. The first entry is the personal
 * account; the rest are orgs the user belongs to. Numbers vary enough that
 * switching accounts visibly changes every screen.
 */
export const ACCOUNTS: Account[] = [
  {
    id: "acct_personal",
    login: "fuadev",
    name: "Fuad Alizada",
    type: "user",
    plan: "Free",
    repoCount: 18,
    memberCount: 1,
    postureScore: 71,
    monthlySpend: 24,
    reclaimable: 6,
  },
  {
    id: "acct_aurora",
    login: "aurora-labs",
    name: "Aurora Labs",
    type: "org",
    plan: "Team",
    repoCount: 42,
    memberCount: 28,
    postureScore: 64,
    monthlySpend: 540,
    reclaimable: 128,
  },
  {
    id: "acct_northwind",
    login: "northwind-oss",
    name: "Northwind OSS",
    type: "org",
    plan: "Team",
    repoCount: 67,
    memberCount: 54,
    postureScore: 83,
    monthlySpend: 210,
    reclaimable: 41,
  },
  {
    id: "acct_helios",
    login: "helios-systems",
    name: "Helios Systems",
    type: "org",
    plan: "Enterprise",
    repoCount: 134,
    memberCount: 96,
    postureScore: 57,
    monthlySpend: 2480,
    reclaimable: 612,
  },
];

export const DEFAULT_ACCOUNT_ID = ACCOUNTS[0]!.id;

export function getAccount(id: string): Account {
  return ACCOUNTS.find((a) => a.id === id) ?? ACCOUNTS[0]!;
}
