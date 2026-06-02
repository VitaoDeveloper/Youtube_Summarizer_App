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
pnpm add react-router-dom axios @tanstack/react-query clsx framer-motion lucide-react
pnpm add -D tailwindcss @tailwindcss/vite
```

| Package | Version | Purpose |
|---------|---------|---------|
| `react-router-dom` | ^7.x | Client-side routing |
| `axios` | ^1.x | HTTP client for API calls |
| `@tanstack/react-query` | ^5.x | Server state management, caching |
| `clsx` | ^2.x | Conditional class name merging |
| `framer-motion` | ^12.x | Declarative animations |
| `lucide-react` | ^0.x | Icon library |
| `tailwindcss` | ^4.x | Utility-first CSS |
| `@tailwindcss/vite` | ^4.x | Tailwind Vite plugin |

### Expected outcome
- `pnpm dev` starts the dev server without errors
- `pnpm build` (tsc -b && vite build) passes
- All dependencies listed in `package.json`

## Verification
```bash
pnpm dev
pnpm build
```
