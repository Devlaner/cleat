import { formatDistanceToNowStrict } from "date-fns";

/** "3 days ago" style relative time from an ISO string. */
export function relativeTime(iso: string): string {
  return formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
}

/** Short date, e.g. "May 12". */
export function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/** Compact number: 1.2k, 3.4M. */
export function compactNumber(n: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/** Thousands-separated integer. */
export function number(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/** USD currency. Whole dollars unless `cents` requested. */
export function currency(n: number, cents = false): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(n);
}

/** Human file size from megabytes. */
export function fromMb(mb: number): string {
  if (mb < 1) return `${Math.round(mb * 1024)} KB`;
  if (mb < 1024) return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}

/** Percentage from a 0..1 fraction. */
export function percent(fraction: number, digits = 0): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}

/** Days until an ISO date (negative = past). */
export function daysUntil(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.round(ms / 86_400_000);
}

/** Pluralize a noun by count: pluralize(1,'repo') -> "1 repo". */
export function pluralize(count: number, noun: string, plural?: string): string {
  const word = count === 1 ? noun : (plural ?? `${noun}s`);
  return `${number(count)} ${word}`;
}
