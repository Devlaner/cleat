import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * The Cleat mark: a shackle bent into a "C" and closed by a pin - a
 * secure-fastening motif that doubles as the monogram. Lavender per DESIGN.md.
 */
export function LogoMark({ className, size = 28 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M22.5 9.4 A 10 10 0 1 0 22.5 22.6"
        stroke="#5e6ad2"
        strokeWidth="4.4"
        strokeLinecap="round"
      />
      <rect x="20.3" y="6.6" width="4.4" height="18.8" rx="2.2" fill="#828fff" />
    </svg>
  );
}

export function Logo({ className, size = 28 }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark size={size} />
      <span className="font-sans text-[1.05rem] font-semibold tracking-[-0.02em] text-ink">
        Cleat
      </span>
    </span>
  );
}
