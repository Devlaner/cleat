import type { Severity } from "@cleat/contracts";

export const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low", "info"];

interface SeverityStyle {
  label: string;
  /** rank for sorting - higher is worse */
  rank: number;
  /** text color class */
  text: string;
  /** tinted background + border for badges */
  badge: string;
  /** solid fill (chart series, dots) - raw hex */
  hex: string;
  /** subtle dot bg */
  dot: string;
}

export const SEVERITY: Record<Severity, SeverityStyle> = {
  critical: {
    label: "Critical",
    rank: 5,
    text: "text-critical",
    badge: "bg-critical/10 text-critical ring-1 ring-inset ring-critical/25",
    hex: "#fb5b78",
    dot: "bg-critical",
  },
  high: {
    label: "High",
    rank: 4,
    text: "text-high",
    badge: "bg-high/10 text-high ring-1 ring-inset ring-high/25",
    hex: "#ff9352",
    dot: "bg-high",
  },
  medium: {
    label: "Medium",
    rank: 3,
    text: "text-medium",
    badge: "bg-medium/10 text-medium ring-1 ring-inset ring-medium/25",
    hex: "#ecc24a",
    dot: "bg-medium",
  },
  low: {
    label: "Low",
    rank: 2,
    text: "text-low",
    badge: "bg-low/10 text-low ring-1 ring-inset ring-low/25",
    hex: "#5b9bf0",
    dot: "bg-low",
  },
  info: {
    label: "Info",
    rank: 1,
    text: "text-info",
    badge: "bg-info/10 text-info ring-1 ring-inset ring-info/25",
    hex: "#8a8f98",
    dot: "bg-info",
  },
};

/** Sort comparator: most severe first. */
export function bySeverityDesc(a: Severity, b: Severity): number {
  return SEVERITY[b].rank - SEVERITY[a].rank;
}

/** Map a CVSS 0–10 score to a severity bucket (CVSS v3 bands). */
export function cvssToSeverity(score: number): Severity {
  if (score >= 9) return "critical";
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  if (score > 0) return "low";
  return "info";
}

export type Grade = "A" | "B" | "C" | "D" | "F";

/** Map a 0–100 posture/hygiene score to a letter grade. */
export function scoreToGrade(score: number): Grade {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 65) return "C";
  if (score >= 50) return "D";
  return "F";
}

export const GRADE_COLOR: Record<Grade, { text: string; hex: string; ring: string }> = {
  A: { text: "text-success", hex: "#27a644", ring: "ring-success/30" },
  B: { text: "text-low", hex: "#5b9bf0", ring: "ring-low/30" },
  C: { text: "text-medium", hex: "#ecc24a", ring: "ring-medium/30" },
  D: { text: "text-high", hex: "#ff9352", ring: "ring-high/30" },
  F: { text: "text-critical", hex: "#fb5b78", ring: "ring-critical/30" },
};
