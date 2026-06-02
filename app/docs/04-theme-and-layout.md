# 04 — Theme and Layout

## Purpose
Build the visual design system (Tailwind v4 `@theme` tokens), responsive layout shell, dark mode toggle, and global styles.

## Technical Specs

### Global Styles — `src/styles/index.css`
```css
@import "tailwindcss";
@import "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";

@theme {
  --font-heading: "Inter", system-ui, sans-serif;
  --font-body: system-ui, "Segoe UI", Roboto, sans-serif;

  --color-brand-50: #eff6ff;
  --color-brand-100: #dbeafe;
  --color-brand-200: #bfdbfe;
  --color-brand-500: #3b82f6;
  --color-brand-600: #2563eb;
  --color-brand-700: #1d4ed8;
  --color-brand-900: #1e3a5f;

  --color-surface: #ffffff;
  --color-surface-muted: #f9fafb;
  --color-muted: #6b7280;
  --color-accent: #8b5cf6;

  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-elevated: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
```

### Dark Mode
Tailwind v4 approach: use `@dark` variant or `class` strategy via `vite.config.ts`:
```ts
// in vite.config.ts — no extra config needed for v4
```

Create `src/context/ThemeContext.tsx`:
```ts
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
```

### Layout Components

**`src/components/layout/Layout.tsx`** — shell wrapping all pages:
- Wraps `<Header />`, `<main className="flex-1 container mx-auto px-4 py-6">`, `<Footer />`
- Uses `flex flex-col min-h-screen`

**`src/components/layout/Header.tsx`**:
- Logo + app name ("YT Summarizer") on the left
- Nav: link to `/summarize` and `/history`
- Dark mode toggle button (Sun/Moon icon from lucide-react)
- Responsive: hamburger menu below `md` breakpoint

**`src/components/layout/Footer.tsx`**:
- Minimal: copyright year, "Built with React + Vite"

### Dark Mode CSS via Tailwind
Use Tailwind's `dark:` variant throughout components. Example:
```tsx
<div className="bg-surface dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
```

## Verification
- Layout renders with header, content area, footer
- Dark mode toggles and persists on refresh
- Responsive: header collapses to hamburger on mobile
- `pnpm build` passes with no type errors
