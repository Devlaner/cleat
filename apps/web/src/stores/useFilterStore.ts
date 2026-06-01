import { create } from "zustand";

export type SortDir = "asc" | "desc";

export interface TableState {
  search: string;
  sortKey: string | null;
  sortDir: SortDir;
  /** facetKey -> selected values (OR within a facet, AND across facets) */
  facets: Record<string, string[]>;
}

const EMPTY: TableState = { search: "", sortKey: null, sortDir: "desc", facets: {} };

interface FilterState {
  tables: Record<string, TableState>;
  get: (key: string) => TableState;
  setSearch: (key: string, value: string) => void;
  setSort: (key: string, sortKey: string) => void;
  toggleFacet: (key: string, facet: string, value: string) => void;
  clear: (key: string) => void;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  tables: {},
  get: (key) => get().tables[key] ?? EMPTY,
  setSearch: (key, value) =>
    set((s) => ({
      tables: { ...s.tables, [key]: { ...(s.tables[key] ?? EMPTY), search: value } },
    })),
  setSort: (key, sortKey) =>
    set((s) => {
      const cur = s.tables[key] ?? EMPTY;
      const sortDir: SortDir = cur.sortKey === sortKey && cur.sortDir === "desc" ? "asc" : "desc";
      return { tables: { ...s.tables, [key]: { ...cur, sortKey, sortDir } } };
    }),
  toggleFacet: (key, facet, value) =>
    set((s) => {
      const cur = s.tables[key] ?? EMPTY;
      const list = cur.facets[facet] ?? [];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return {
        tables: {
          ...s.tables,
          [key]: { ...cur, facets: { ...cur.facets, [facet]: next } },
        },
      };
    }),
  clear: (key) => set((s) => ({ tables: { ...s.tables, [key]: EMPTY } })),
}));

/** Subscribe to one table's filter state. */
export function useTableState(key: string): TableState {
  return useFilterStore((s) => s.tables[key] ?? EMPTY);
}
