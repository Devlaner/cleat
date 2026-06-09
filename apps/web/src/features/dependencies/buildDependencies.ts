import { Rng } from "@/data/rng";
import { PACKAGES } from "@/data/catalog";
import { cvssToSeverity } from "@/lib/severity";
import type { Severity } from "@cleat/contracts";
import type { Dataset } from "@contracts/types";

export interface Dependency {
  id: string;
  name: string;
  ecosystem: string;
  version: string;
  latestVersion: string;
  license: string;
  usedByRepos: number;
  vulnerable: boolean;
  vulnSeverity?: Severity;
  outdated: boolean;
  direct: boolean;
}

const LICENSES: [string, number][] = [
  ["MIT", 10],
  ["Apache-2.0", 6],
  ["BSD-3-Clause", 4],
  ["ISC", 3],
  ["MPL-2.0", 2],
  ["LGPL-3.0", 1],
  ["GPL-3.0", 1],
  ["AGPL-3.0", 1],
  ["Unlicensed", 1],
];

export const COPYLEFT = new Set(["GPL-3.0", "AGPL-3.0", "LGPL-3.0"]);

/** Deterministic dependency inventory derived from the account's dataset. */
export function buildDependencies(ds: Dataset): Dependency[] {
  const r = new Rng(`${ds.account.id}_deps`);
  const vulnByPkg = new Map<string, Severity>();
  for (const v of ds.vulnerabilities) {
    const existing = vulnByPkg.get(v.package);
    if (!existing || cvssToSeverity(v.cvss) === "critical") vulnByPkg.set(v.package, v.severity);
  }

  const out: Dependency[] = [];
  for (const [ecosystem, names] of Object.entries(PACKAGES)) {
    for (const name of names) {
      const major = r.int(1, 8);
      const version = `${major}.${r.int(0, 9)}.${r.int(0, 30)}`;
      const outdated = r.chance(0.4);
      const latestVersion = outdated
        ? `${major + r.int(0, 2)}.${r.int(0, 9)}.${r.int(0, 30)}`
        : version;
      const sev = vulnByPkg.get(name);
      out.push({
        id: `${ds.account.id}_dep_${ecosystem}_${name}`,
        name,
        ecosystem,
        version,
        latestVersion,
        license: r.weighted(LICENSES),
        usedByRepos: r.int(1, Math.max(2, Math.round(ds.repos.length * 0.5))),
        vulnerable: !!sev,
        vulnSeverity: sev,
        outdated,
        direct: r.chance(0.55),
      });
    }
  }
  return out.sort(
    (a, b) => Number(b.vulnerable) - Number(a.vulnerable) || a.name.localeCompare(b.name),
  );
}

/** License distribution for the compliance chart. */
export function licenseDistribution(deps: Dependency[]) {
  const map = new Map<string, number>();
  for (const d of deps) map.set(d.license, (map.get(d.license) ?? 0) + 1);
  const palette = [
    "#5e6ad2",
    "#828fff",
    "#5b9bf0",
    "#27a644",
    "#ecc24a",
    "#7a7fad",
    "#ff9352",
    "#fb5b78",
    "#62666d",
  ];
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([license, count], i) => ({
      license,
      count,
      hex: palette[i % palette.length]!,
      copyleft: COPYLEFT.has(license),
    }));
}
