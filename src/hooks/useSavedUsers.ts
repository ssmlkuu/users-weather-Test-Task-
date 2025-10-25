import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { RandomUser } from "../lib/types";

const KEY = "saved-users-v1";

// === storage helpers ===
function getSnapshotString(): string {
  const raw = localStorage.getItem(KEY);
  return raw ?? "[]";
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function write(list: RandomUser[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
}

export function useSavedUsers() {
  const snapshotStr = useSyncExternalStore(
    subscribe,
    getSnapshotString,
    getSnapshotString
  );

  const list: RandomUser[] = useMemo(() => {
    try { return JSON.parse(snapshotStr) as RandomUser[]; } catch { return []; }
  }, [snapshotStr]);

  const has = useCallback((id: string) => list.some(u => u.id === id), [list]);

  const save = useCallback((u: RandomUser) => {
    if (has(u.id)) return;
    write([...list, u]);
  }, [list, has]);

  const remove = useCallback((id: string) => {
    write(list.filter(u => u.id !== id));
  }, [list]);

  const clear = useCallback(() => {
    write([]);
  }, []);

  return useMemo(() => ({ list, has, save, remove, clear }), [list, has, save, remove, clear]);
}