# 02 — Config and Folder Structure

## Purpose
Configure path aliases, strict ESLint rules, Tailwind v4, shadcn/ui, and a clean folder structure that scales.

## Technical Specs

### Folder Structure
```
src/
  components/
    ui/           # shadcn/ui primitives (Button, Input, Card, etc.)
    layout/       # Header, Footer, Layout, PageTransition
    home/         # HomePage-specific components
    summary/      # SummarizePage-specific components
  pages/          # one file per route
  hooks/          # custom React hooks
  api/            # HTTP client + endpoint modules
  types/          # TypeScript interfaces, enums, type guards
  lib/            # pure utilities, helpers, constants
  utils/          # cn(), formatters, validation functions
  locales/        # i18n JSON files (pt.json, en.json, es.json)
  mocks/          # MSW handlers and browser setup
  context/        # React Context providers
  styles/         # global CSS, Tailwind entry point
  assets/         # static images, SVGs (existing)
```

### Path Alias (`@/`)
Create `tsconfig.paths.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./app/src/*"]
    }
  }
}
```
Extend it in `tsconfig.app.json`:
```json
{
  "extends": "./tsconfig.paths.json"
}
```

Update `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### ESLint (strict mode)
Update `eslint.config.js` to use `recommendedTypeChecked` + `react-x` and `react-dom` plugins:

```ts
import tseslint from 'typescript-eslint'
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

### Tailwind CSS Entry — `src/styles/index.css`
```css
@import "tailwindcss";

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

Update `src/main.tsx` to import `./styles/index.css` instead of `./index.css`.

### shadcn/ui — `src/utils/cn.ts`
shadcn init creates this automatically. Ensure it uses `clsx`:
```ts
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
```

## Verification
- `pnpm dev` compiles without path resolution errors
- `pnpm lint` uses type-aware rules
- Imports like `import { Button } from '@/components/ui/button'` resolve correctly
