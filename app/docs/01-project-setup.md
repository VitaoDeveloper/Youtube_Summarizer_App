# 01 — Project Setup

## Purpose
Scaffold a Vite + React + TypeScript project with all production dependencies installed. This is the foundation for the YouTube Summarizer app.

## Technical Specs

### Command
```bash
pnpm create vite@latest . --template react-ts
```

### Dependencies to install
```bash
pnpm add react-router-dom axios @tanstack/react-query clsx framer-motion lucide-react sonner next-themes react-hook-form @hookform/resolvers zod react-i18next i18next i18next-browser-languagedetector react-markdown remark-gfm date-fns
pnpm add -D tailwindcss @tailwindcss/vite msw
```

### Initialize shadcn/ui
```bash
pnpm dlx shadcn@latest init
```
- Choose: New York style, Neutral color, CSS variables (yes)
- Adjust `components.json` to use `@/` prefix and `cn` utility from `clsx`

### Add shadcn components (base set)
```bash
pnpm dlx shadcn@latest add button input card skeleton dialog
```

| Package | Version | Purpose |
|---------|---------|---------|
| `react-router-dom` | ^7.x | Client-side routing |
| `axios` | ^1.x | HTTP client for API calls |
| `@tanstack/react-query` | ^5.x | Server state management |
| `clsx` | ^2.x | Conditional class merging (used by shadcn) |
| `framer-motion` | ^12.x | Declarative animations |
| `lucide-react` | ^0.x | Icon library |
| `sonner` | ^2.x | Toast notifications |
| `next-themes` | ^0.x | Dark mode with persistence |
| `react-hook-form` | ^7.x | Performant form state |
| `@hookform/resolvers` | ^5.x | Zod resolver for RHF |
| `zod` | ^3.x | Schema validation |
| `react-i18next` | ^15.x | i18n React bindings |
| `i18next` | ^24.x | Internationalization framework |
| `i18next-browser-languagedetector` | ^8.x | Auto language detection |
| `react-markdown` | ^10.x | Render markdown summaries |
| `remark-gfm` | ^4.x | GFM tables/links in markdown |
| `date-fns` | ^4.x | Date formatting |
| `tailwindcss` | ^4.x | Utility-first CSS |
| `@tailwindcss/vite` | ^4.x | Tailwind Vite plugin |
| `msw` | ^2.x | API mocking in dev |

### Expected outcome
- `pnpm dev` starts the dev server without errors
- `pnpm build` (tsc -b && vite build) passes
- All dependencies listed in `package.json`
- shadcn/ui initialized with `components/ui/` populated

## Verification
```bash
pnpm dev
pnpm build
```
