import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { GithubMark } from "@/components/ui/GithubMark";

const COLUMNS: { title: string; links: string[] }[] = [
  { title: "Product", links: ["Overview", "Security scans", "Artifacts & cost", "Audit log", "Changelog"] },
  { title: "Solutions", links: ["Open source", "Startups", "Enterprise", "Security teams"] },
  { title: "Resources", links: ["Docs", "API", "Advisory database", "Status", "Support"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Privacy", "Terms"] },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-16 sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2">
          <Logo />
          <p className="mt-3 max-w-xs text-caption text-ink-subtle">
            Security, maintenance and audit for your GitHub account and organizations.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-caption font-medium text-ink-muted">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-caption text-ink-subtle transition-colors hover:text-ink">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-hairline px-6 py-6 sm:flex-row">
        <p className="text-caption text-ink-tertiary">© {new Date().getFullYear()} Cleat. A demo product.</p>
        <div className="flex items-center gap-4 text-ink-subtle">
          <a href="#" className="transition-colors hover:text-ink"><GithubMark size={16} /></a>
          <Link to="/connect" className="text-caption transition-colors hover:text-ink">Get started →</Link>
        </div>
      </div>
    </footer>
  );
}
