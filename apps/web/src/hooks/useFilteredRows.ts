import { useMemo } from "react";
import { useTableState } from "@/stores/useFilterStore";

export interface FacetDef<T> {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  /** value(s) of this facet for a row */
  accessor: (row: T) => string | string[];
}

export interface FilterConfig<T> {
  /** text searched against (joined, lowercased) */
  search?: (row: T) => string;
  facets?: FacetDef<T>[];
}

/** Applies the table's search + facet selections to rows (sorting is done in DataTable). */
export function useFilteredRows<T>(tableKey: string, rows: T[], config: FilterConfig<T>): T[] {
  const ts = useTableState(tableKey);

  return useMemo(() => {
    const q = ts.search.trim().toLowerCase();
    return rows.filter((row) => {
      if (q && config.search) {
        if (!config.search(row).toLowerCase().includes(q)) return false;
      }
      for (const facet of config.facets ?? []) {
        const selected = ts.facets[facet.key] ?? [];
        if (selected.length === 0) continue;
        const v = facet.accessor(row);
        const values = Array.isArray(v) ? v : [v];
        if (!values.some((x) => selected.includes(x))) return false;
      }
      return true;
    });
  }, [rows, config, ts.search, ts.facets]);
}
