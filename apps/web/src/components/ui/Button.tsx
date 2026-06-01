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
    "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-focus shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset]",
  secondary:
    "bg-surface-1 text-ink ring-1 ring-inset ring-hairline hover:bg-surface-2 hover:ring-hairline-strong",
  ghost: "bg-transparent text-ink-subtle hover:bg-surface-1 hover:text-ink",
  inverse: "bg-ink text-canvas hover:bg-white",
  danger:
    "bg-critical/12 text-critical ring-1 ring-inset ring-critical/30 hover:bg-critical/20",
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
        "transition-all duration-150 disabled:pointer-events-none disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
});
