# 05 — UI Components

## Purpose
Build accessible, reusable, theme-aware UI primitives that all pages will use.

## Technical Specs

### Utility — `src/utils/cn.ts`
```ts
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
```
(Tailwind v4 doesn't need `tailwind-merge` — use `clsx` alone.)

### Components (all in `src/components/ui/`)

#### `button.tsx`
```ts
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 disabled:bg-brand-200',
  secondary: 'bg-surface-muted dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700',
  ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
  danger: 'bg-red-500 text-white hover:bg-red-600',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
```

#### `input.tsx`
- Props: `label`, `error`, `icon`, `wrapperClassName` 
- Renders `<label>`, optional icon slot, `<input>` with focus ring, error message below
- Type: `interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; icon?: ReactNode }`

#### `card.tsx`
- Compound component: `<Card>`, `<CardHeader>`, `<CardContent>`, `<CardFooter>`
- Each is a `<div>` with pre-defined Tailwind classes (bg-surface, rounded-xl, shadow-card, p-6, etc.)
- Uses `cn()` for className merging

#### `skeleton.tsx`
```tsx
interface SkeletonProps { className?: string }
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-md bg-gray-200 dark:bg-gray-700', className)} />
}
```

#### `toast.tsx`
- `src/hooks/useToast.ts` — Context-based toast manager
- `addToast(message, type: 'success' | 'error' | 'info')` → shows toast, auto-dismisses after 4s
- Renders fixed bottom-right stack of toasts with icons and close button
- Animations via framer-motion `AnimatePresence`

#### `dialog.tsx`
- Props: `open`, `onClose`, `title`, `children`
- Renders portal overlay with backdrop blur
- Close on: Escape key, click outside, X button
- Focus trap: auto-focus first focusable element on open, restore on close
- Body scroll lock via `overflow: hidden`
- `aria-modal="true"`, `role="dialog"`

## Verification
- `pnpm lint` passes with no warnings
- Every component renders correctly in both light and dark mode
- Button loading state disables click and shows spinner
- Dialog traps focus and closes on Escape
