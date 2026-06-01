import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Renders children at a fixed design size and scales them to fit the container
 * width (transform: scale). Used to embed the real product UI as a crisp,
 * always-in-sync "screenshot" on the marketing site. The visible height crops
 * to `viewportHeight` so we show the top of a tall page.
 */
export function ScaledFrame({
  designWidth,
  viewportHeight,
  children,
  className,
}: {
  designWidth: number;
  /** visible (design-space) height; the inner content is cropped to this */
  viewportHeight: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / designWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [designWidth]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)} style={{ height: viewportHeight * scale }}>
      <div
        style={{
          width: designWidth,
          height: viewportHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          opacity: scale ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
