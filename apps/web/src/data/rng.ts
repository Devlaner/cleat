/** Deterministic pseudo-random generator so dummy data is stable per account. */

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFromString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const DAY = 86_400_000;

export class Rng {
  private next: () => number;

  constructor(seed: string | number) {
    this.next = mulberry32(typeof seed === "string" ? seedFromString(seed) : seed);
  }

  /** float in [0, 1) */
  float(): number {
    return this.next();
  }

  /** integer in [min, max] inclusive */
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /** float in [min, max) rounded to `digits` */
  range(min: number, max: number, digits = 2): number {
    const v = this.next() * (max - min) + min;
    const p = 10 ** digits;
    return Math.round(v * p) / p;
  }

  /** true with probability p */
  chance(p: number): boolean {
    return this.next() < p;
  }

  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.next() * arr.length)]!;
  }

  /** pick n distinct items (or fewer if arr is small) */
  pickN<T>(arr: readonly T[], n: number): T[] {
    const pool = [...arr];
    const out: T[] = [];
    const count = Math.min(n, pool.length);
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(this.next() * pool.length);
      out.push(pool.splice(idx, 1)[0]!);
    }
    return out;
  }

  /** weighted pick: entries of [value, weight] */
  weighted<T>(entries: readonly [T, number][]): T {
    const total = entries.reduce((s, [, w]) => s + w, 0);
    let r = this.next() * total;
    for (const [value, w] of entries) {
      r -= w;
      if (r <= 0) return value;
    }
    return entries[entries.length - 1]![0];
  }

  /** ISO timestamp between `minDaysAgo` and `maxDaysAgo` from now */
  daysAgo(minDaysAgo: number, maxDaysAgo: number): string {
    const days = this.range(minDaysAgo, maxDaysAgo, 3);
    return new Date(Date.now() - days * DAY).toISOString();
  }

  /** ISO timestamp `minDays`..`maxDays` in the future */
  daysAhead(minDays: number, maxDays: number): string {
    const days = this.range(minDays, maxDays, 3);
    return new Date(Date.now() + days * DAY).toISOString();
  }

  /** short hex string, e.g. for commit shas */
  hex(len: number): string {
    let s = "";
    while (s.length < len) s += Math.floor(this.next() * 16).toString(16);
    return s.slice(0, len);
  }
}
