import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ToastVariant = "default" | "success" | "danger" | "info";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface UiState {
  /** desktop sidebar collapsed to icons */
  sidebarCollapsed: boolean;
  /** mobile sidebar drawer open */
  mobileNavOpen: boolean;
  /** ⌘K command palette open */
  commandOpen: boolean;
  toasts: Toast[];

  toggleSidebar: () => void;
  setMobileNav: (open: boolean) => void;
  setCommandOpen: (open: boolean) => void;
  toggleCommand: () => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      mobileNavOpen: false,
      commandOpen: false,
      toasts: [],

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setMobileNav: (open) => set({ mobileNavOpen: open }),
      setCommandOpen: (open) => set({ commandOpen: open }),
      toggleCommand: () => set((s) => ({ commandOpen: !s.commandOpen })),

      addToast: (toast) => {
        const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
        setTimeout(() => {
          if (get().toasts.some((t) => t.id === id)) {
            set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
          }
        }, 4200);
      },
      dismissToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: "cleat-ui",
      // only persist layout prefs
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }) as UiState,
    },
  ),
);
