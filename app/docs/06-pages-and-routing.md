# 06 — Pages and Routing

## Purpose
Create the router and all page components with React Router v7.

## Technical Specs

### Router — `src/router.tsx`
```ts
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { SummarizePage } from '@/pages/SummarizePage'
import { HistoryPage } from '@/pages/HistoryPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'summarize', element: <SummarizePage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
```

Update `src/main.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/context/ThemeContext'
import { router } from '@/router'
import '@/styles/index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
```

### Pages

**`src/pages/HomePage.tsx`**
- Hero section: headline ("YouTube Summarizer"), subtitle ("Paste any YouTube link and get a concise summary in seconds"), CTA button linking to `/summarize`
- Feature highlights (3 cards): "AI-Powered Summaries", "Key Points Extraction", "Search History"
- Uses lucide-react icons, framer-motion fade-up on scroll
- Mobile-responsive grid (1 col → 3 col)

**`src/pages/SummarizePage.tsx`**
- Two-panel layout (vertical stack on mobile, side-by-side on `lg+`)
- Left panel: URL input form (Input component + Submit Button), validation error display
- Right panel: summary results area with 4 states:
  - Empty state: "Enter a YouTube URL to get started" (with arrow icon pointing to input)
  - Loading state: Skeleton blocks (title, paragraph, key points list)
  - Success state: video title + thumbnail, summary text, key points list (bullets), duration
  - Error state: error message with retry button
- Uses `useSummarize` hook (defined later)

**`src/pages/HistoryPage.tsx`**
- Title: "Summary History"
- Search bar to filter by video title
- List of cards: thumbnail (left), title + date (center), "View" button (right)
- Empty state: "No summaries yet. Go summarize a video!"
- Clicking a card navigates to `/summarize?id=xxx` to re-view results

**`src/pages/NotFoundPage.tsx`**
- "404 — Page not found" message
- "Go home" link to `/`

## Types — `src/types/router.ts`
```ts
export interface RouteHandle {
  title?: string
}
```

## Verification
- Navigate between all 3 pages without page reload (SPA)
- `/` → `/summarize` → `/history` works
- Invalid route shows 404 page
- `pnpm build` passes
