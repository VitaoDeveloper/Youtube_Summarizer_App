# 09 — UX Polish

## Purpose
Add animations, transitions, empty/error states, keyboard shortcuts, and performance optimizations for a premium feel.

## Technical Specs

### Empty State — `src/components/ui/empty-state.tsx`
```tsx
import { cn } from '@/utils/cn'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center', className)}>
      <div className="text-muted">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
      {description && <p className="text-sm text-muted max-w-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
```

### Error Boundary — `src/components/ui/error-boundary.tsx`
```tsx
import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-brand-500 underline"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
```
Wrap `Layout` in `src/router.tsx` children with `<ErrorBoundary>`.

### Page Transitions — `src/components/layout/PageTransition.tsx`
```tsx
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props { children: ReactNode }

export function PageTransition({ children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
```
Wrap page content in each page component.

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
  'Ctrl+Enter': () => handleSubmit(),
  'Escape': () => { setUrl(''); setValidationError(null) },
})
```

### Formatters — `src/utils/formatters.ts`
```ts
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))
}

export function truncateText(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max).trimEnd() + '…'
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
```

### Loading & Skeleton States
- Every async section uses `<Skeleton>` — not just a single spinner
- `SummarizePage` right panel: 3 skeleton blocks (title: w-2/3 h-6, paragraph: h-20, list: 3x h-4)
- `HistoryPage`: card-shaped skeletons while loading

### Toast Notifications (from 05-ui-components.md)
Wire `useToast` into mutation hooks:
```ts
const { addToast } = useToast()
const summarize = useSummarize({
  onSuccess: () => addToast('Summary generated!', 'success'),
  onError: (err) => addToast(err.message, 'error'),
})
```

## Files Created/Modified
- `src/components/ui/empty-state.tsx` — NEW
- `src/components/ui/error-boundary.tsx` — NEW
- `src/components/layout/PageTransition.tsx` — NEW
- `src/hooks/useKeyboard.ts` — NEW
- `src/utils/formatters.ts` — NEW
- Various pages — MODIFIED (wrap content in PageTransition, add EmptyState, use toast)

## Verification
- Navigate between pages — smooth fade/slide animation
- Error boundary catches render crashes — shows "Try again"
- Empty history shows EmptyState with action link to `/summarize`
- `Ctrl+Enter` submits the form on SummarizePage
- `pnpm build` passes
