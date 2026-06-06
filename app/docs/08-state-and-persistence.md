# 08 — State and Persistence

## Purpose
Manage local UI state, persist history to localStorage, validate YouTube URLs in real time, and integrate i18n with useTranslation.

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

export { YOUTUBE_REGEX }
```

### History Context — `src/context/HistoryContext.tsx`
- Provides `history: SummaryListItem[]`, `addToHistory(item)`, `removeFromHistory(id)`, `clearHistory()`
- Persists to localStorage via `useLocalStorage` (max 50 items, newest first)
- Syncs with API history on mount (merges localStorage cache with API data)
- Wraps app in `main.tsx` inside QueryClientProvider

### Form State Pattern (SummarizePage)
Use react-hook-form + Zod (already set up in Prompt 06):
```ts
const schema = z.object({
  url: z.string().min(1, t('errors.required')).refine(isValidYoutubeUrl, t('errors.invalidUrl')),
})
type FormData = z.infer<typeof schema>

const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
  resolver: zodResolver(schema),
})

const onSubmit = (data: FormData) => {
  summarizeMutation.mutate(data.url)
}
```
- Validation clears reactively as user types (RHF default behavior)
- Error message displayed via shadcn Input's error slot or a `<p>` with `aria-describedby`

### i18n Usage Pattern
```tsx
import { useTranslation } from 'react-i18next'

function HomePage() {
  const { t } = useTranslation()
  return <h1>{t('home.title')}</h1>
}
```

All user-facing strings use `t()` — no hardcoded English strings outside of locale JSON files.

### Dark Mode Persistence
Already handled by `next-themes` (Prompt 04). Theme persists in localStorage automatically.

## Files Created/Modified
- `src/hooks/useLocalStorage.ts` — NEW
- `src/hooks/useMediaQuery.ts` — NEW
- `src/utils/validation.ts` — NEW
- `src/context/HistoryContext.tsx` — NEW
- `src/pages/SummarizePage.tsx` — MODIFIED (add RHF form)
- `src/main.tsx` — MODIFIED (add HistoryProvider if created)

## Verification
- Close and reopen browser — dark mode persists
- Paste invalid URL — real-time error message via RHF + Zod
- All UI text is translated via `t()` — switch browser language to see PT/ES
- `pnpm build` passes
