/**
 * Ecosystem & secret-provider metadata. lucide ships no brand glyphs, so we
 * render compact colored monogram chips instead - consistent across Secrets,
 * Vulnerabilities, Dependencies and SBOM screens.
 */

export interface ChipMeta {
  label: string;
  short: string;
  /** raw hex for the chip foreground/tint */
  hex: string;
}

export const ECOSYSTEM: Record<string, ChipMeta> = {
  npm: { label: "npm", short: "npm", hex: "#cb3837" },
  pypi: { label: "PyPI", short: "py", hex: "#4b8bbe" },
  go: { label: "Go", short: "go", hex: "#00add8" },
  maven: { label: "Maven", short: "mvn", hex: "#e34c26" },
  rubygems: { label: "RubyGems", short: "gem", hex: "#cc342d" },
  nuget: { label: "NuGet", short: "nu", hex: "#004880" },
  cargo: { label: "Cargo", short: "rs", hex: "#dea584" },
  composer: { label: "Composer", short: "php", hex: "#777bb3" },
  docker: { label: "Docker", short: "dkr", hex: "#2496ed" },
  actions: { label: "Actions", short: "gha", hex: "#2088ff" },
};

export function ecosystem(key: string): ChipMeta {
  return ECOSYSTEM[key] ?? { label: key, short: key.slice(0, 3), hex: "#8a8f98" };
}

export const PROVIDER: Record<string, ChipMeta> = {
  aws: { label: "AWS", short: "aws", hex: "#ff9900" },
  github: { label: "GitHub PAT", short: "gh", hex: "#f7f8f8" },
  openai: { label: "OpenAI", short: "ai", hex: "#10a37f" },
  stripe: { label: "Stripe", short: "stp", hex: "#635bff" },
  google: { label: "Google Cloud", short: "gcp", hex: "#4285f4" },
  slack: { label: "Slack", short: "slk", hex: "#e01e5a" },
  postgres: { label: "Postgres URI", short: "pg", hex: "#4169e1" },
  ssh: { label: "SSH Key", short: "ssh", hex: "#8a8f98" },
  jwt: { label: "JWT", short: "jwt", hex: "#d63aff" },
  twilio: { label: "Twilio", short: "tw", hex: "#f22f46" },
};

export function provider(key: string): ChipMeta {
  return PROVIDER[key] ?? { label: key, short: key.slice(0, 3), hex: "#8a8f98" };
}

/** Primary-language → dot color, GitHub-style. */
export const LANGUAGE_COLOR: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572a5",
  Go: "#00add8",
  Rust: "#dea584",
  Ruby: "#701516",
  Java: "#b07219",
  "C++": "#f34b7d",
  "C#": "#178600",
  PHP: "#4f5d95",
  Shell: "#89e051",
  HCL: "#844fba",
  Dockerfile: "#384d54",
};

export function languageColor(lang: string): string {
  return LANGUAGE_COLOR[lang] ?? "#8a8f98";
}
