export type SummaryResponse = {
  id: string
  videoId: string
  title: string
  thumbnail: string
  summary: string
  keyPoints: string[]
  duration: number
  createdAt: string
}

export type SummaryListItem = {
  id: string
  videoId: string
  title: string
  thumbnail: string
  createdAt: string
}

export type ApiError = {
  message: string
  code: string
  status: number
}

export type User = {
  id: string
  name: string
  email: string
}

export type AuthResponse = {
  user: User
  token: string
}

export type LoginDto = {
  email: string
  password: string
}

export type RegisterDto = {
  name: string
  email: string
  password: string
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  pageSize: number
}
