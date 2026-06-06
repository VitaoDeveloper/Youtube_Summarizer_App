# 04 — Theme and Layout

## Purpose
Build the visual design system (Tailwind v4 `@theme` tokens), responsive layout shell, dark mode via `next-themes`, and global styles.

## Technical Specs

### Global Styles — `src/styles/index.css`
Already defined in Prompt 02. Ensure `@theme` tokens are present.

### Dark Mode with next-themes
Wrap the app in `src/main.tsx`:
```tsx
import { ThemeProvider } from 'next-themes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* ... rest of providers ... */}
    </ThemeProvider>
  </StrictMode>,
)
```
- `attribute="class"` toggles `dark` class on `<html>` (Tailwind's dark mode strategy)
- `defaultTheme="system"` respects OS preference
- `enableSystem` syncs with `prefers-color-scheme`

Use the theme in components:
```tsx
import { useTheme } from 'next-themes'
const { theme, setTheme } = useTheme()
// toggle: setTheme(theme === 'dark' ? 'light' : 'dark')
```

### Layout Components

**`src/components/layout/Layout.tsx`** — shell wrapping all pages:
- Wraps `<Header />`, `<main className="flex-1 container mx-auto px-4 py-6">`, `<Footer />`
- Uses `flex flex-col min-h-screen`

**`src/components/layout/Header.tsx`**:
- Logo + app name ("YT Summarizer") on the left
- Nav: link to `/summarize` and `/history`
- Dark mode toggle button (Sun/Moon icon from lucide-react, calls `setTheme`)
- Responsive: hamburger menu below `md` breakpoint

**`src/components/layout/Footer.tsx`**:
- Minimal: copyright year, "Built with React + Vite"

### Dark Mode CSS via Tailwind
Use Tailwind's `dark:` variant throughout components. Example:
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
```

## Verification
- Layout renders with header, content area, footer
- Dark mode toggles via next-themes and persists on refresh
- Responsive: header collapses to hamburger on mobile
- `pnpm build` passes with no type errors
