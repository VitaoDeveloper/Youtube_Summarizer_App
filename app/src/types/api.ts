export type SummaryResponse = {
  id: string
  slug: string
  userId: string
  videoId: string
  videoTitle: string
  thumbnail: string
  summary: string
  language: string
  topics: string[]
  length: number
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

export type UserResponse = {
  id: string
  name: string
  email: string
  password: string
  apiKey: string
  createdAt: string
  //summaries: SummaryResponse[]
}

export type User = {
  id: string
  name: string
  email: string
}

export type AuthResponse = {
  access: boolean
  token?: string
}

export type LoginDto = {
  email: string
  password: string
}

export type RegisterDto = {
  name: string
  email: string
  password: string
  apiKey: string
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  pageSize: number
}
