import { useMemo, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { EmptyState } from "./EmptyState";
import { useFilterStore, useTableState } from "@/stores/useFilterStore";

export interface Column<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** providing this makes the column sortable */
  sortValue?: (row: T) => string | number;
  align?: "left" | "right" | "center";
  /** tailwind width/utility classes for the cell + header */
  className?: string;
  /** hide the column below this breakpoint */
  hideBelow?: "sm" | "md" | "lg" | "xl";
}

const HIDE: Record<NonNullable<Column<unknown>["hideBelow"]>, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
};

const ALIGN = { left: "text-left", right: "text-right", center: "text-center" } as const;

interface DataTableProps<T> {
  tableKey: string;
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: { icon: LucideIcon; title: string; description?: string };
  /** leading selection / control column */
  selectable?: {
    isSelected: (row: T) => boolean;
    onToggle: (row: T) => void;
    allSelected?: boolean;
    onToggleAll?: () => void;
  };
}

export function DataTable<T>({
  tableKey,
  columns,
  rows,
  getRowId,
  onRowClick,
  empty,
  selectable,
}: DataTableProps<T>) {
  const ts = useTableState(tableKey);
  const setSort = useFilterStore((s) => s.setSort);

  const sorted = useMemo(() => {
    if (!ts.sortKey) return rows;
    const col = columns.find((c) => c.id === ts.sortKey);
    if (!col?.sortValue) return rows;
    const dir = ts.sortDir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [rows, columns, ts.sortKey, ts.sortDir]);

  if (rows.length === 0 && empty) {
    return (
      <div className="rounded-lg border border-hairline bg-surface-1">
        <EmptyState icon={empty.icon} title={empty.title} description={empty.description} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-surface-1">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-body-sm">
          <thead>
            <tr className="border-b border-hairline">
              {selectable && (
                <th className="w-10 px-3 py-2.5">
                  <Checkbox
                    checked={!!selectable.allSelected}
                    onChange={() => selectable.onToggleAll?.()}
                    label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => {
                const sortable = !!col.sortValue;
                const active = ts.sortKey === col.id;
                return (
                  <th
                    key={col.id}
                    className={cn(
                      "px-3 py-2.5 text-caption font-medium text-ink-subtle",
                      ALIGN[col.align ?? "left"],
                      col.hideBelow && HIDE[col.hideBelow],
                      col.className,
                    )}
                  >
                    {sortable ? (
                      <button
                        aria-label={`Sort by ${String(col.header)}`}
                        onClick={() => setSort(tableKey, col.id)}
                        className={cn(
                          "inline-flex items-center gap-1 transition-colors hover:text-ink",
                          col.align === "right" && "flex-row-reverse",
                          active && "text-ink",
                        )}
                      >
                        {col.header}
                        {active ? (
                          ts.sortDir === "asc" ? (
                            <ArrowUp className="size-3" />
                          ) : (
                            <ArrowDown className="size-3" />
                          )
                        ) : (
                          <ChevronsUpDown className="size-3 opacity-50" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={getRowId(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "border-b border-hairline/60 last:border-0 transition-colors",
                  onRowClick && "cursor-pointer hover:bg-surface-2",
                )}
              >
                {selectable && (
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectable.isSelected(row)}
                      onChange={() => selectable.onToggle(row)}
                      label={`Select ${getRowId(row)}`}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={cn(
                      "px-3 py-2.5 text-ink-muted",
                      ALIGN[col.align ?? "left"],
                      col.hideBelow && HIDE[col.hideBelow],
                      col.className,
                    )}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Checkbox({
  checked,
  onChange,
  label = "Toggle selection",
}: {
  checked: boolean;
  onChange: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "flex size-4 items-center justify-center rounded border transition-colors",
        checked
          ? "border-primary bg-primary text-on-primary"
          : "border-hairline-strong hover:border-ink-subtle",
      )}
    >
      {checked && (
        <svg viewBox="0 0 12 12" className="size-3" fill="none">
          <path
            d="M2.5 6.5 5 9l4.5-5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
