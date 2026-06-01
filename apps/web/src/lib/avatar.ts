/** Deterministic gradient + initials for an avatar, seeded from a string. */

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Avatars stay inside one on-brand hue family — the DESIGN.md "brand-secure"
 * lavender-gray (#7a7fad) — and vary only by tone. This keeps profile badges
 * distinguishable (by shade + initials) without introducing the off-brand chroma
 * that a multi-color palette would, honoring the single-accent system.
 */
// Tonal pairs (top = lighter, bottom = darker; same lavender-gray hue).
const TONES: [string, string][] = [
  ["#6f7491", "#494d66"],
  ["#5d6280", "#3d4156"],
  ["#676c88", "#43475d"],
  ["#545872", "#34374a"],
  ["#737893", "#4d5169"],
  ["#5a5e78", "#393c50"],
  ["#626783", "#3f4258"],
  ["#4f5369", "#303344"],
];

/** A subtle same-hue tonal gradient (not chromatic), stable per seed. */
export function gradientFor(seed: string): string {
  const [a, b] = TONES[hash(seed) % TONES.length]!;
  return `linear-gradient(150deg, ${a}, ${b})`;
}

/** Up to two initials from a name or handle. */
export function initials(name: string): string {
  const parts = name
    .trim()
    .split(/[\s-_]+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
}
