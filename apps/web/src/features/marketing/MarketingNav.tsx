import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const LINKS = [
  { label: "Product", href: "#features" },
  { label: "Security", href: "#trust" },
  { label: "Pricing", href: "#pricing" },
  { label: "Changelog", href: "#" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "border-b border-hairline bg-canvas/80 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-6">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-body-sm text-ink-subtle transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/connect">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link to="/connect">
            <Button variant="primary" size="sm">Get started</Button>
          </Link>
        </div>

        <button
          className="rounded-md p-1.5 text-ink-subtle md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-hairline bg-canvas px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} className="rounded-md px-2 py-2 text-body-sm text-ink-muted" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <Link to="/connect" className="mt-2">
              <Button variant="primary" className="w-full">Get started</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
