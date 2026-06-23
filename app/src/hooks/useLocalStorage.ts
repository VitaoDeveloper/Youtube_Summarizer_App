import { useState, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T, raw?: boolean) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return initialValue
      return raw ? (item as T) : (JSON.parse(item) as T)
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue(prev => {
        const next = value instanceof Function ? value(prev) : value
        localStorage.setItem(key, raw ? (next as string) : JSON.stringify(next))
        return next
      })
    },
    [key, raw],
  )

  return [storedValue, setValue] as const
}
