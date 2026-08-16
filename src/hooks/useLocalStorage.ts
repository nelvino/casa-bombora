"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Persisted piece of state, backed by localStorage under `key`.
 * `isValid` guards against corrupt/stale/foreign values in storage (e.g. an
 * old tab name after the tab list changes) so callers never get handed
 * something outside their expected type.
 *
 * Only the returned setter writes to storage. Restoring the saved value on
 * mount goes through the raw state setter instead, so it can never race with
 * (and get clobbered by) a write - which matters because React 18 Strict
 * Mode double-invokes effects in dev, and two effects each doing a
 * read-then-write here would otherwise race and silently drop the restore.
 */
export function useLocalStorage<T extends string>(
  key: string,
  initialValue: T,
  isValid: (value: string) => value is T
): [T, (value: T) => void] {
  const [value, setInternalValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null && isValid(saved)) setInternalValue(saved);
    } catch {}
    // Only restore once, on mount for this key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback(
    (next: T) => {
      setInternalValue(next);
      try {
        localStorage.setItem(key, next);
      } catch {}
    },
    [key]
  );

  return [value, setValue];
}
