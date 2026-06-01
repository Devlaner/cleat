import { Search, ListFilter } from "lucide-react";
import { LiveIndicator } from "@/components/ui/LiveIndicator";

/** Page header used inside marketing previews (mirrors the real PageHeader). */
export function PreviewHeader({
  eyebrow,
  title,
  description,
  live,
}: {
  eyebrow: string;
  title: string;
  description: string;
  live?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="mb-1 text-eyebrow uppercase text-ink-tertiary">{eyebrow}</p>
        <h1 className="text-headline font-semibold text-ink">{title}</h1>
        <p className="mt-1 max-w-2xl text-body-sm text-ink-subtle">{description}</p>
      </div>
      {live && <LiveIndicator>{live}</LiveIndicator>}
    </div>
  );
}

/** A non-interactive look-alike of the FilterBar for previews. */
export function PreviewFilterBar({ facets, count, noun }: { facets: string[]; count: number; noun: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex h-9 w-full max-w-xs items-center gap-2 rounded-md border border-hairline bg-surface-1 px-3 text-ink-tertiary">
        <Search className="size-4" />
        <span className="text-body-sm">Search…</span>
      </div>
      {facets.map((f) => (
        <span key={f} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline bg-surface-1 px-3 text-body-sm text-ink-subtle">
          <ListFilter className="size-3.5" />
          {f}
        </span>
      ))}
      <span className="ml-auto text-caption tabular-nums text-ink-tertiary">{count} {noun}</span>
    </div>
  );
}
