import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-4 text-center">
      <Logo size={32} />
      <div>
        <p className="text-display-md font-semibold text-ink">404</p>
        <p className="mt-2 text-body text-ink-subtle">This page wandered off the map.</p>
      </div>
      <Link to="/app/overview">
        <Button variant="primary">Back to dashboard</Button>
      </Link>
    </div>
  );
}
