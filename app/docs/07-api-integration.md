# 07 — API Integration

## Purpose
Build the HTTP client layer with axios (real) and MSW (mock), typed endpoints, React Query hooks, and MSW handlers for dev mode.

## Technical Specs

### Environment Variables — `.env`
```
VITE_API_URL=http://localhost:3001/api
VITE_USE_MOCKS=true
```
Access in code: `import.meta.env.VITE_API_URL`, `import.meta.env.VITE_USE_MOCKS`

### Types — `src/types/api.ts`
```ts
export interface SummaryResponse {
  id: string
  videoId: string
  title: string
  thumbnail: string
  summary: string
  keyPoints: string[]
  duration: number // seconds
  createdAt: string // ISO 8601
}

export interface SummaryListItem {
  id: string
  videoId: string
  title: string
  thumbnail: string
  createdAt: string
}

export interface ApiError {
  message: string
  code: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
```

### Axios Client — `src/api/client.ts`
```ts
import axios, { type AxiosError } from 'axios'
import type { ApiError } from '@/types/api'
import i18n from '@/lib/i18n'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError<ApiError>) => {
    const formatted: ApiError = {
      message: error.response?.data?.message ?? i18n.t('errors.network'),
      code: error.response?.data?.code ?? 'UNKNOWN_ERROR',
      status: error.response?.status ?? 0,
    }
    return Promise.reject(formatted)
  },
)

export { apiClient }
```

### Endpoints — `src/api/youtube.ts`
```ts
import { apiClient } from './client'
import type { SummaryListItem, SummaryResponse } from '@/types/api'

export async function postSummary(videoUrl: string): Promise<SummaryResponse> {
  const { data } = await apiClient.post<SummaryResponse>('/summaries', { url: videoUrl })
  return data
}

export async function getHistory(page = 1, pageSize = 20): Promise<PaginatedResponse<SummaryListItem>> {
  const { data } = await apiClient.get('/summaries', { params: { page, pageSize } })
  return data
}

export async function getSummaryById(id: string): Promise<SummaryResponse> {
  const { data } = await apiClient.get<SummaryResponse>(`/summaries/${id}`)
  return data
}

export async function deleteSummary(id: string): Promise<void> {
  await apiClient.delete(`/summaries/${id}`)
}
```

### MSW Handlers — `src/mocks/handlers.ts`
```ts
import { http, HttpResponse, delay } from 'msw'
import type { SummaryResponse, SummaryListItem } from '@/types/api'

const mockSummaries: SummaryResponse[] = [
  {
    id: '1',
    videoId: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    summary: 'This is a mock summary of the video. It covers the main topics discussed.',
    keyPoints: ['Point one', 'Point two', 'Point three'],
    duration: 212,
    createdAt: new Date().toISOString(),
  },
]

const mockHistory: SummaryListItem[] = mockSummaries.map(({ id, videoId, title, thumbnail, createdAt }) => ({
  id, videoId, title, thumbnail, createdAt,
}))

export const handlers = [
  http.post('/api/summaries', async ({ request }) => {
    await delay(1500)
    const { url } = await request.json() as { url: string }
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return HttpResponse.json({ message: 'Invalid YouTube URL', code: 'INVALID_URL' }, { status: 400 })
    }
    return HttpResponse.json(mockSummaries[0], { status: 201 })
  }),

  http.get('/api/summaries', async () => {
    await delay(500)
    return HttpResponse.json({ data: mockHistory, total: mockHistory.length, page: 1, pageSize: 20 })
  }),

  http.get('/api/summaries/:id', async ({ params }) => {
    await delay(500)
    const summary = mockSummaries.find(s => s.id === params.id)
    if (!summary) return HttpResponse.json({ message: 'Not found', code: 'NOT_FOUND' }, { status: 404 })
    return HttpResponse.json(summary)
  }),

  http.delete('/api/summaries/:id', async () => {
    await delay(300)
    return HttpResponse.json(null, { status: 204 })
  }),
]
```

### MSW Browser Setup — `src/mocks/browser.ts`
```ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

### Enable MSW — `src/main.tsx`
```tsx
async function startApp() {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { worker } = await import('@/mocks/browser')
    await worker.start()
  }

  const root = document.getElementById('root')!
  createRoot(root).render(
    <StrictMode>
      {/* providers */}
    </StrictMode>,
  )
}

startApp()
```

### React Query Hooks

**`src/hooks/useSummarize.ts`**
```ts
import { useMutation } from '@tanstack/react-query'
import { postSummary } from '@/api/youtube'
import type { SummaryResponse } from '@/types/api'

export function useSummarize() {
  return useMutation({
    mutationFn: postSummary,
  })
}
```

**`src/hooks/useHistory.ts`**
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getHistory, getSummaryById, deleteSummary } from '@/api/youtube'

export function useHistory(page = 1) {
  return useQuery({
    queryKey: ['history', page],
    queryFn: () => getHistory(page),
  })
}

export function useSummaryDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['summary', id],
    queryFn: () => getSummaryById(id!),
    enabled: !!id,
  })
}

export function useDeleteSummary() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSummary,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['history'] }),
  })
}
```

### Global Query Config — `src/main.tsx`
```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false },
  },
})
```

## Verification
- `VITE_USE_MOCKS=true` → MSW intercepts requests (see browser console: `[MSW]`)
- `VITE_USE_MOCKS=false` → real API calls
- TypeScript passes with strict mode — no `any`
- Error interceptor returns i18n-translated messages
