# 09 — UX Polish

## Purpose
Add markdown rendering for summaries, date formatting with date-fns, Sonner toast integration with mutations, keyboard shortcuts, and refined loading/empty states.

## Technical Specs

### Markdown Summary — `src/components/summary/SummaryContent.tsx`
Render the summary field as markdown:
```tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props { content: string }

export function SummaryContent({ content }: Props) {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </article>
  )
}
```

### Date Formatting — `src/utils/formatters.ts`
Use date-fns instead of manual formatting:
```ts
import { format, formatDistanceToNow } from 'date-fns'
import { enUS, ptBR, es } from 'date-fns/locale'

const locales: Record<string, Locale> = { en: enUS, pt: ptBR, es }

export function formatDate(iso: string, lang = 'en'): string {
  return format(new Date(iso), 'MMM d, yyyy – HH:mm', { locale: locales[lang] ?? enUS })
}

export function timeAgo(iso: string, lang = 'en'): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: locales[lang] ?? enUS })
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function truncateText(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max).trimEnd() + '…'
}
```

### Toast Notifications with Sonner
Wire toast into mutation hooks on SummarizePage:
```tsx
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()
const summarize = useSummarize()

const onSubmit = (data: FormData) => {
  summarize.mutate(data.url, {
    onSuccess: () => toast.success(t('summary.success')),
    onError: (err: ApiError) => toast.error(err.message),
  })
}
```

### Keyboard Shortcuts — `src/hooks/useKeyboard.ts`
```ts
import { useEffect } from 'react'

type KeyHandler = Record<string, (e: KeyboardEvent) => void>

export function useKeyboard(handlers: KeyHandler) {
  useEffect(() => {
    function listener(e: KeyboardEvent) {
      const key = [e.ctrlKey || e.metaKey ? 'Ctrl+' : '', e.key].join('')
      const handler = handlers[key] ?? handlers[e.key]
      if (handler) handler(e)
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [handlers])
}
```

Usage in SummarizePage:
```ts
useKeyboard({
  'Ctrl+Enter': () => handleSubmit(onSubmit)(),
  'Escape': () => { setValue('url', ''); resetField('url') },
})
```

### Loading & Skeleton States
- Every async section uses shadcn `<Skeleton>` — not just a single spinner
- `SummarizePage` right panel: 3 skeleton blocks (title: `w-2/3 h-6`, paragraph: `h-20`, list: `h-4` × 3)
- `HistoryPage`: card-shaped skeletons while loading (use `Skeleton` as card placeholder)

### Page Transitions
Wrap each page's JSX with `<PageTransition>` from Prompt 05:
```tsx
import { PageTransition } from '@/components/layout/PageTransition'

export function HomePage() {
  return (
    <PageTransition>
      {/* page content */}
    </PageTransition>
  )
}
```

### Empty States (from Prompt 05)
Used in:
- `HistoryPage` — when history list is empty
- `SummarizePage` — before any URL is submitted

## Files Created/Modified
- `src/components/summary/SummaryContent.tsx` — NEW
- `src/utils/formatters.ts` — NEW (using date-fns)
- `src/hooks/useKeyboard.ts` — NEW
- `src/pages/SummarizePage.tsx` — MODIFIED (add toast, keyboard shortcuts, SummaryContent)
- `src/pages/HistoryPage.tsx` — MODIFIED (add date-fns formatting)
- All pages — MODIFIED (wrap with PageTransition)

## Verification
- Summary renders markdown (bold, links, lists) correctly
- Dates show localized relative time via date-fns
- Sonner toast appears on success/error
- `Ctrl+Enter` submits the form
- `Escape` clears the input
- `pnpm build` passes
