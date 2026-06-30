import { useCallback, useEffect, useState } from "react";

/** Estado persistido en localStorage, namespaced bajo "nexus:". */
export function useLocalStorage<T>(key: string, initial: T) {
  const fullKey = `nexus:${key}`;
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(fullKey);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(fullKey, JSON.stringify(value));
    } catch {
      /* cuota llena / modo privado: ignorar */
    }
  }, [fullKey, value]);

  return [value, setValue] as const;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
}

/** Hook de hora en vivo (actualiza cada segundo). */
export function useClock(): Date {
  const [now, setNow] = useState(() => new Date());
  const tick = useCallback(() => setNow(new Date()), []);
  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);
  return now;
}
