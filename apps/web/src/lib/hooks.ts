import { useEffect, useRef, type RefObject } from "react";

/** Calls `handler` when a pointerdown happens outside the ref element. */
export function useClickOutside<T extends HTMLElement>(
  handler: () => void,
  active = true,
): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!active) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) handler();
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [handler, active]);
  return ref;
}

/** Calls `handler` on Escape keydown. */
export function useEscape(handler: () => void, active = true) {
  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handler();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handler, active]);
}

/** Registers a global hotkey, e.g. ("k", true) for ⌘/Ctrl+K. */
export function useHotkey(key: string, handler: () => void, meta = false) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const metaOk = meta ? e.metaKey || e.ctrlKey : true;
      if (metaOk && e.key.toLowerCase() === key.toLowerCase()) {
        if (meta) e.preventDefault();
        handler();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [key, handler, meta]);
}
