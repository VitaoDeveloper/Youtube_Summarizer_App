# 07 — API Integration

## Purpose
Build the HTTP client layer with axios, typed endpoints, and React Query hooks for server state.

## Technical Specs

### Environment Variables
Create `.env` in `app/`:
```
VITE_API_URL=http://localhost:3001/api
```
Access in code: `import.meta.env.VITE_API_URL`

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

### Axios Client — `src/services/api.ts`
```ts
import axios, { type AxiosError } from 'axios'
import type { ApiError } from '@/types/api'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError<ApiError>) => {
    const formatted: ApiError = {
      message: error.response?.data?.message ?? 'Network error. Please try again.',
      code: error.response?.data?.code ?? 'UNKNOWN_ERROR',
      status: error.response?.status ?? 0,
    }
    return Promise.reject(formatted)
  },
)

export { apiClient }
```

### Endpoints — `src/services/youtube.ts`
```ts
import { apiClient } from './api'
import type { SummaryListItem, SummaryResponse } from '@/types/api'

export async function postSummary(videoUrl: string): Promise<SummaryResponse> {
  const { data } = await apiClient.post<SummaryResponse>('/summaries', { url: videoUrl })
  return data
}

export async function getHistory(page = 1, pageSize = 20): Promise<{ data: SummaryListItem[]; total: number }> {
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

### React Query Hooks

**`src/hooks/useSummarize.ts`**
```ts
import { useMutation } from '@tanstack/react-query'
import { postSummary } from '@/services/youtube'
import type { SummaryResponse, ApiError } from '@/types/api'

interface UseSummarizeOptions {
  onSuccess?: (data: SummaryResponse) => void
  onError?: (error: ApiError) => void
}

export function useSummarize(options?: UseSummarizeOptions) {
  return useMutation({
    mutationFn: postSummary,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}
```

**`src/hooks/useHistory.ts`**
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getHistory, getSummaryById, deleteSummary } from '@/services/youtube'
import type { ApiError } from '@/types/api'

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

### Global Error Handler
In `src/main.tsx`, configure a default React Query error handler:
```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error: unknown) => {
        const apiError = error as ApiError
        // toast notification handled by useToast in components
        console.error('[API Error]', apiError)
      },
    },
  },
})
```

## Verification
- `apiClient` is created with correct baseURL from env
- TypeScript passes with strict mode — no `any`
- Hooks return correct types matching API responses
- Error interceptor transforms axios errors into `ApiError` shape
