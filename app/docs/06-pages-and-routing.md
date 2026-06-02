# 06 — Pages and Routing

## Purpose
Create the router and all page components with React Router v7, react-hook-form + Zod for forms, and react-i18next for translations.

## Technical Specs

### Router — `src/router.tsx`
```ts
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { HomePage } from '@/pages/HomePage'
import { SummarizePage } from '@/pages/SummarizePage'
import { HistoryPage } from '@/pages/HistoryPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'summarize', element: <SummarizePage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
```

### Main Entry — `src/main.tsx`
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { router } from '@/router'
import '@/styles/index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <RouterProvider router={router} />
        <Toaster richColors position="bottom-right" />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
```

### i18n Setup — `src/lib/i18n.ts`
```ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from '@/locales/en.json'
import pt from '@/locales/pt.json'
import es from '@/locales/es.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, pt: { translation: pt }, es: { translation: es } },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n
```
Import in `main.tsx`: `import '@/lib/i18n'`

### Locale Files

**`src/locales/en.json`**
```json
{
  "home": {
    "title": "YouTube Summarizer",
    "subtitle": "Paste any YouTube link and get a concise summary in seconds",
    "cta": "Get Started",
    "feature1": "AI-Powered Summaries",
    "feature2": "Key Points Extraction",
    "feature3": "Search History"
  },
  "summary": {
    "title": "Summarize Video",
    "inputLabel": "YouTube URL",
    "inputPlaceholder": "https://youtube.com/watch?v=...",
    "submit": "Summarize",
    "submitting": "Summarizing...",
    "empty": "Enter a YouTube URL to get started",
    "duration": "Duration",
    "keyPoints": "Key Points"
  },
  "history": {
    "title": "Summary History",
    "empty": "No summaries yet. Go summarize a video!",
    "searchPlaceholder": "Search by title..."
  },
  "errors": {
    "network": "Network error. Please try again.",
    "invalidUrl": "Please enter a valid YouTube URL",
    "required": "This field is required",
    "generic": "Something went wrong"
  },
  "notFound": {
    "title": "404 — Page not found",
    "link": "Go home"
  }
}
```
Create mirror files in `pt.json` (Portuguese) and `es.json` (Spanish) with translated values.

### Pages

**`src/pages/HomePage.tsx`**
- Hero section with `t('home.title')`, `t('home.subtitle')`, CTA button linking to `/summarize`
- Feature highlights (3 cards): uses lucide-react icons, framer-motion fade-up
- Mobile-responsive grid (1 col → 3 col)

**`src/pages/SummarizePage.tsx`**
- Two-panel layout (vertical stack on mobile, side-by-side on `lg+`)
- Form with react-hook-form + Zod:
  ```ts
  const schema = z.object({ url: z.string().url(t('errors.invalidUrl')).regex(YOUTUBE_REGEX, t('errors.invalidUrl')) })
  type FormData = z.infer<typeof schema>
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })
  ```
- Left panel: URL input with shadcn `<Input>`, validation error, `<Button>` submit
- Right panel: summary results with 4 states (controlled by `useSummarize` mutation):
  - Empty: `<EmptyState>` with `t('summary.empty')`
  - Loading: `<Skeleton>` blocks
  - Success: video title + thumbnail, summary as markdown (`<ReactMarkdown>`), key points list
  - Error: error message + retry `<Button>`

**`src/pages/HistoryPage.tsx`**
- Title: `t('history.title')`
- Search input with `<Input>` to filter by video title (local state filter)
- List of shadcn `<Card>`: thumbnail (left), title + date (center), "View" button (right)
- Empty state: `<EmptyState>` with `t('history.empty')`, action link to `/summarize`
- Click card → navigate to `/summarize?id=xxx`

**`src/pages/NotFoundPage.tsx`**
- `t('notFound.title')` message
- Link to `/` with `t('notFound.link')`

### Types — `src/types/router.ts`
```ts
export interface RouteHandle {
  title?: string
}
```

## Verification
- Navigate between all 3 pages without page reload
- i18n language detection works (browser preference)
- Form validates URL with Zod and shows translated errors
- `pnpm build` passes
