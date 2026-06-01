import { useMemo } from "react";
import { useDataset } from "./useDataset";
import { useNotificationStore } from "@/stores/useNotificationStore";
import type { ActivityEvent } from "@/data/types";

export interface NotificationItem extends ActivityEvent {
  read: boolean;
}

/** Activity events for the active account, merged with persisted read-state. */
export function useNotifications() {
  const ds = useDataset();
  const readIds = useNotificationStore((s) => s.readIds);

  return useMemo(() => {
    const items: NotificationItem[] = ds.events.map((e) => ({
      ...e,
      read: readIds.includes(e.id),
    }));
    const unread = items.filter((i) => !i.read).length;
    return { items, unread };
  }, [ds.events, readIds]);
}
