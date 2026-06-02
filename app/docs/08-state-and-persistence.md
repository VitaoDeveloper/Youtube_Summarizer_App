# 08 — State and Persistence

## Purpose
Manage local UI state, persist user preferences and history, validate YouTube URLs in real time.

## Technical Specs

### Generic localStorage Hook — `src/hooks/useLocalStorage.ts`
```ts
import { useState, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue(prev => {
        const next = value instanceof Function ? value(prev) : value
        localStorage.setItem(key, JSON.stringify(next))
        return next
      })
    },
    [key],
  )

  return [storedValue, setValue] as const
}
```

### Media Query Hook — `src/hooks/useMediaQuery.ts`
```ts
import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}
```

### YouTube URL Validation — `src/utils/validation.ts`
```ts
const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
const VIDEO_ID_REGEX = /(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/

export function isValidYoutubeUrl(url: string): boolean {
  return YOUTUBE_REGEX.test(url.trim())
}

export function extractVideoId(url: string): string | null {
  const match = url.match(VIDEO_ID_REGEX)
  return match?.[1] ?? null
}
```

### History Context — `src/context/HistoryContext.tsx`
- Provides `history: SummaryListItem[]`, `addToHistory(item)`, `removeFromHistory(id)`, `clearHistory()`
- Persists to localStorage via `useLocalStorage` (max 50 items, newest first)
- Syncs with API history on mount (merges localStorage cache with server data)
- `HistoryContext.Provider` wraps app in `main.tsx`

### Form State Pattern (SummarizePage)
Use controlled form with local state:
```ts
const [url, setUrl] = useState('')
const [validationError, setValidationError] = useState<string | null>(null)

function handleSubmit() {
  const trimmed = url.trim()
  if (!trimmed) { setValidationError('Please enter a URL'); return }
  if (!isValidYoutubeUrl(trimmed)) { setValidationError('Please enter a valid YouTube URL'); return }
  setValidationError(null)
  summarizeMutation.mutate(trimmed)
}
```
Validation clears as user types (useEffect or onChange).

### Theme Context (from 04-theme-and-layout.md)
Already persists to localStorage. Reuses `useLocalStorage` pattern internally.

## Files Created/Modified
- `src/hooks/useLocalStorage.ts` — NEW
- `src/hooks/useMediaQuery.ts` — NEW
- `src/utils/validation.ts` — NEW
- `src/context/HistoryContext.tsx` — NEW
- `src/pages/SummarizePage.tsx` — MODIFIED (add validation logic)
- `src/main.tsx` — MODIFIED (add HistoryProvider)

## Verification
- Close and reopen browser — theme persists
- Summarize a video — appears in history after page refresh
- Paste invalid URL — see error message before submit
- `pnpm build` passes
