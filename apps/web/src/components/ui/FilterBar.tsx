import { Search, ListFilter, X, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { Popover } from "./Popover";
import { useFilterStore, useTableState } from "@/stores/useFilterStore";
import type { FacetDef } from "@/hooks/useFilteredRows";

interface FilterBarProps<T> {
  tableKey: string;
  facets?: FacetDef<T>[];
  searchPlaceholder?: string;
  /** filtered count / total for the result label */
  count?: number;
  total?: number;
  noun?: string;
  /** extra controls rendered on the right */
  right?: React.ReactNode;
}

export function FilterBar<T>({
  tableKey,
  facets = [],
  searchPlaceholder = "Search…",
  count,
  total,
  noun = "results",
  right,
}: FilterBarProps<T>) {
  const ts = useTableState(tableKey);
  const setSearch = useFilterStore((s) => s.setSearch);
  const toggleFacet = useFilterStore((s) => s.toggleFacet);
  const clear = useFilterStore((s) => s.clear);

  const activeFacetCount = Object.values(ts.facets).reduce((n, arr) => n + arr.length, 0);
  const hasFilters = activeFacetCount > 0 || ts.search.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-0 flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-tertiary" />
        <input
          value={ts.search}
          onChange={(e) => setSearch(tableKey, e.target.value)}
          placeholder={searchPlaceholder}
          className="h-9 w-full rounded-md border border-hairline bg-surface-1 pl-8 pr-3 text-body-sm text-ink placeholder:text-ink-tertiary transition-colors focus:border-hairline-strong focus:outline-none"
        />
      </div>

      {facets.map((facet) => {
        const selected = ts.facets[facet.key] ?? [];
        return (
          <Popover
            key={facet.key}
            trigger={() => (
              <span
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-body-sm transition-colors",
                  selected.length > 0
                    ? "border-primary/40 bg-primary/10 text-ink"
                    : "border-hairline bg-surface-1 text-ink-subtle hover:text-ink",
                )}
              >
                <ListFilter className="size-3.5" />
                {facet.label}
                {selected.length > 0 && (
                  <span className="rounded-full bg-primary/20 px-1.5 text-[0.6875rem] tabular-nums text-primary-hover">
                    {selected.length}
                  </span>
                )}
              </span>
            )}
          >
            <div className="w-48">
              {facet.options.map((opt) => {
                const on = selected.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggleFacet(tableKey, facet.key, opt.value)}
                    className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-body-sm text-ink-muted transition-colors hover:bg-surface-3"
                  >
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded border",
                        on ? "border-primary bg-primary text-on-primary" : "border-hairline-strong",
                      )}
                    >
                      {on && <Check className="size-3" />}
                    </span>
                    <span className="flex-1 truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </Popover>
        );
      })}

      {hasFilters && (
        <button
          onClick={() => clear(tableKey)}
          className="inline-flex h-9 items-center gap-1 rounded-md px-2 text-caption text-ink-subtle transition-colors hover:text-ink"
        >
          <X className="size-3.5" /> Clear
        </button>
      )}

      <div className="ml-auto flex items-center gap-3">
        {typeof count === "number" && (
          <span className="text-caption tabular-nums text-ink-tertiary">
            {count}
            {typeof total === "number" && total !== count ? ` / ${total}` : ""} {noun}
          </span>
        )}
        {right}
      </div>
    </div>
  );
}
