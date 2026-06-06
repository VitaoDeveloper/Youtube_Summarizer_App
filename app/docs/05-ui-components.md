# 05 — UI Components

## Purpose
Set up shadcn/ui primitives (already initialized in Prompt 01), add Sonner for toasts, and create a custom EmptyState component.

## Technical Specs

### shadcn/ui Primitives
Already installed in Prompt 01. Available at `src/components/ui/`:
- `button.tsx` — polymorphic, variants (default/destructive/outline/secondary/ghost/link), sizes
- `input.tsx` — with label, error state, focus ring
- `card.tsx` — compound: `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`, `<CardFooter>`
- `skeleton.tsx` — shimmer animation placeholder
- `dialog.tsx` — accessible modal with overlay, focus trap, Escape dismiss

**Do not modify shadcn/ui files directly.** They are treated as external primitives. Configure via `components.json` if needed.

### Sonner — Toast System
Add `<Toaster>` in `src/main.tsx`:
```tsx
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!.render(
  <StrictMode>
    <Toaster richColors position="bottom-right" />
    {/* ... */}
  </StrictMode>,
))
```

Usage in components:
```tsx
import { toast } from 'sonner'
toast.success('Summary generated!')
toast.error('Invalid URL')
toast.info('Processing...')
```

### Custom Components

**`src/components/ui/empty-state.tsx`** — reusable empty state:
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
      <div className="text-muted-foreground">{icon}</div>
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
```

**`src/components/ui/error-boundary.tsx`** — React Error Boundary:
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
          <p className="text-sm text-muted-foreground">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-primary underline"
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

**`src/components/layout/PageTransition.tsx`** — framer-motion page wrapper:
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

## Verification
- `pnpm lint` passes with no warnings
- Sonner `<Toaster>` renders without error
- EmptyState renders icon + title + description
- ErrorBoundary catches thrown errors and shows fallback
- PageTransition animates children on mount
