import { useCallback, useState } from 'react';

type StoredValue<T> = T | ((currentValue: T) => T);

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) as T : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback((nextValue: StoredValue<T>) => {
    setValue((currentValue) => {
      const resolvedValue = typeof nextValue === 'function'
        ? (nextValue as (value: T) => T)(currentValue)
        : nextValue;

      try {
        window.localStorage.setItem(key, JSON.stringify(resolvedValue));
      } catch {
        // The UI still works when storage is unavailable or full.
      }

      return resolvedValue;
    });
  }, [key]);

  return [value, setStoredValue] as const;
}
