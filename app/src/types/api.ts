export interface SummaryResponse {
  id: string
  videoId: string
  title: string
  thumbnail: string
  summary: string
  keyPoints: string[]
  duration: number
  createdAt: string
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
