# 02 — Config and Folder Structure

## Purpose
Configure path aliases, strict ESLint rules, Tailwind v4, and a clean folder structure that scales.

## Technical Specs

### Folder Structure
```
src/
  components/
    ui/           # reusable primitives (Button, Input, Card, etc.)
    layout/       # Header, Footer, Layout, PageTransition
  pages/          # one file per route
  hooks/          # custom React hooks
  services/       # API client + endpoint modules
  types/          # TypeScript interfaces, enums, type guards
  utils/          # pure helper functions, constants, cn()
  styles/         # global CSS, Tailwind entry point
  context/        # React Context providers
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

### Tailwind CSS Entry
Create `src/styles/index.css`:
```css
@import "tailwindcss";

@theme {
  --color-brand-50: #f0f7ff;
  --color-brand-100: #e0effe;
  --color-brand-500: #3b82f6;
  --color-brand-700: #1d4ed8;
  --color-brand-900: #1e3a5f;
}
```

Update `src/main.tsx` to import `./styles/index.css` instead of `./index.css`.

## Verification
- `pnpm dev` compiles without path resolution errors
- `pnpm lint` uses type-aware rules
- Imports like `import { Button } from '@/components/ui/button'` resolve correctly
