import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary !text-white hover:bg-primary-hover active:bg-primary-focus shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",

  secondary: "bg-surface-1 text-ink ring-1 ring-inset ring-hairline hover:bg-surface-2",

  ghost: "bg-transparent text-ink-subtle hover:bg-surface-1 hover:text-ink",

  inverse: "bg-ink text-canvas hover:bg-surface-2",

  danger: "bg-critical/10 text-critical ring-1 ring-inset ring-critical/30 hover:bg-critical/15",
};

// Heights grow to a ~44px touch target on coarse pointers (touch devices) only,
// leaving the desktop (fine-pointer) sizing untouched.
const SIZES: Record<Size, string> = {
  sm: "h-7 gap-1.5 px-2.5 text-caption rounded-md pointer-coarse:h-9",
  md: "h-9 gap-2 px-3.5 text-button rounded-md pointer-coarse:h-11",
  lg: "h-11 gap-2 px-5 text-button rounded-md",
  icon: "h-9 w-9 justify-center rounded-md pointer-coarse:size-11",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "secondary", size = "md", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex select-none items-center justify-center font-medium whitespace-nowrap",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "transition-all duration-150 disabled:pointer-events-none disabled:bg-surface-2 disabled:text-ink-muted",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
});
