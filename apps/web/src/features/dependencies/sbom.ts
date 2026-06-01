import type { Dependency } from "./buildDependencies";

const PURL_TYPE: Record<string, string> = {
  npm: "npm",
  pypi: "pypi",
  go: "golang",
  maven: "maven",
  rubygems: "gem",
};

function purl(d: Dependency): string {
  return `pkg:${PURL_TYPE[d.ecosystem] ?? d.ecosystem}/${d.name}@${d.version}`;
}

/** Build an SPDX 2.3 JSON document (abridged) for the inventory. */
export function buildSpdx(account: string, deps: Dependency[]): string {
  return JSON.stringify(
    {
      spdxVersion: "SPDX-2.3",
      dataLicense: "CC0-1.0",
      SPDXID: "SPDXRef-DOCUMENT",
      name: `${account}-sbom`,
      documentNamespace: `https://cleat.dev/sbom/${account}/${Date.now()}`,
      creationInfo: { created: new Date().toISOString(), creators: ["Tool: Cleat"] },
      packages: deps.map((d, i) => ({
        SPDXID: `SPDXRef-Package-${i}`,
        name: d.name,
        versionInfo: d.version,
        downloadLocation: "NOASSERTION",
        licenseConcluded: d.license,
        externalRefs: [
          {
            referenceCategory: "PACKAGE-MANAGER",
            referenceType: "purl",
            referenceLocator: purl(d),
          },
        ],
      })),
    },
    null,
    2,
  );
}

/** Build a CycloneDX 1.5 JSON document (abridged) for the inventory. */
export function buildCycloneDx(account: string, deps: Dependency[]): string {
  return JSON.stringify(
    {
      bomFormat: "CycloneDX",
      specVersion: "1.5",
      serialNumber: `urn:uuid:${crypto.randomUUID()}`,
      version: 1,
      metadata: {
        timestamp: new Date().toISOString(),
        tools: [{ vendor: "Cleat", name: "cleat-sbom" }],
        component: { type: "application", name: account },
      },
      components: deps.map((d) => ({
        type: "library",
        name: d.name,
        version: d.version,
        purl: purl(d),
        licenses: [{ license: { id: d.license } }],
      })),
    },
    null,
    2,
  );
}
