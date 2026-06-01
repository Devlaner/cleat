import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Tracks read/dismissed state for critical-event notifications. The events
 * themselves are derived per-account from seed data; this store only remembers
 * which the user has seen. Filled out with UI in Phase 9.
 */
interface NotificationState {
  readIds: string[];
  isRead: (id: string) => boolean;
  markRead: (id: string) => void;
  markAllRead: (ids: string[]) => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      readIds: [],
      isRead: (id) => get().readIds.includes(id),
      markRead: (id) =>
        set((s) => (s.readIds.includes(id) ? s : { readIds: [...s.readIds, id] })),
      markAllRead: (ids) =>
        set((s) => ({ readIds: Array.from(new Set([...s.readIds, ...ids])) })),
      reset: () => set({ readIds: [] }),
    }),
    { name: "cleat-notifications" },
  ),
);
