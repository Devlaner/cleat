import { cn } from "@/lib/cn";
import { gradientFor, initials } from "@/lib/avatar";

interface AvatarProps {
  /** name or handle - drives gradient + initials */
  seed: string;
  label?: string;
  size?: number;
  rounded?: "full" | "md";
  className?: string;
}

export function Avatar({ seed, label, size = 28, rounded = "md", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-semibold text-white/95 select-none ring-1 ring-inset ring-white/10",
        rounded === "full" ? "rounded-full" : "rounded-md",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: gradientFor(seed),
        fontSize: size * 0.4,
      }}
      aria-label={label ?? seed}
      title={label ?? seed}
    >
      {initials(label ?? seed)}
    </span>
  );
}
