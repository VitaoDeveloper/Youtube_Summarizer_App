# YouTube Summarizer

A modern web application that extracts concise, AI-powered summaries from YouTube videos. Built with React 19, Vite 8, and TypeScript 6.

## Tech Stack

| Category          | Libraries                                                                 |
| ----------------- | ------------------------------------------------------------------------- |
| **Core**          | React 19 · Vite 8 · TypeScript 6                                         |
| **Styling**       | Tailwind CSS v4 · shadcn/ui · clsx · Lucide React                        |
| **Routing**       | React Router v7                                                           |
| **State / Data**  | TanStack Query v5 · React Hook Form + Zod · Axios                        |
| **International** | react-i18next + i18next-browser-languagedetector (en / pt / es)           |
| **UX**            | framer-motion · Sonner toast · next-themes · react-markdown + remark-gfm  |
| **Dev / Mock**    | MSW (Mock Service Worker) · ESLint strict · date-fns                      |

## Features

- **YouTube URL validation** — client-side validation with Zod
- **AI summaries** — submit a YouTube link and receive a structured summary
- **Markdown rendering** — summaries displayed as formatted markdown with GFM support
- **History** — persisted to localStorage (up to 50 entries) with search
- **Dark mode** — toggleable, persisted via next-themes
- **Internationalization** — English, Portuguese (Brazil), and Spanish — auto-detected or manually switched
- **Keyboard shortcuts** — Ctrl+Enter to submit, Escape to close dialogs
- **Responsive layout** — hamburger menu on mobile, full nav on desktop
- **Page transitions** — framer-motion animations between routes
- **Mock mode** — development runs against MSW handlers by default (`VITE_USE_MOCKS=true`)

## Getting Started

```bash
pnpm install
pnpm dev          # starts Vite dev server on http://localhost:5173
pnpm build        # TypeScript build + Vite production build
pnpm lint         # ESLint type-aware linting
pnpm preview      # preview production build
```

## Environment

| Variable        | Default | Description                                 |
| --------------- | ------- | ------------------------------------------- |
| `VITE_USE_MOCKS` | `true`  | Toggle MSW mock mode (set `false` for real API) |
| `VITE_API_URL`   | —       | Base URL for the YouTube summary API        |

## Project Structure

```
src/
├── api/            # Axios client + YouTube endpoint definitions
├── components/
│   ├── layout/     # Header, Footer, Layout
│   ├── ui/         # shadcn/ui primitives + LanguageSwitcher
│   └── shared/     # EmptyState, ErrorBoundary, PageTransition, SummaryContent
├── context/        # HistoryContext (localStorage-backed)
├── hooks/          # useSummarize, useHistory, useLocalStorage, useMediaQuery, useKeyboard
├── lib/            # i18n configuration
├── locales/        # en.json, pt.json, es.json
├── mocks/          # MSW handlers + browser worker setup
├── pages/          # HomePage, SummarizePage, HistoryPage, NotFoundPage
├── styles/         # Tailwind CSS v4 entry (theme tokens, dark/light variables)
├── types/          # API response types
└── utils/          # cn, validation, formatters, languageConfig
```

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short imperative summary
```

Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`.
