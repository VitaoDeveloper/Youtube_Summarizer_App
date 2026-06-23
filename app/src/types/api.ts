type Length = 'short'| 'medium' |  'long';

export type SummaryResponse = {
  id: string
  slug: string
  userId: string
  videoId: string
  videoTitle: string
  summary: string
  language: string
  topics: string[]
  length: Length
  createdAt: string
}

export type SummaryListItem = {
  id: string
  videoId: string
  videoTitle: string
  createdAt: string
}

export type SummaryRequest = {
  videoUrl: string,
  userId: string,
  length: Length,
  language: string
}

export type ApiError = {
  message: string
  code: string
  status: number
}

export type AiProvider = 'openai' | 'anthropic' | 'google'

export type UserResponse = {
  id: string
  name: string
  email: string
  password: string
  apiKey: string
  llmProvider: AiProvider
  createdAt: string
  summaries: SummaryResponse[]
}

export type User = {
  id: string
  name: string
  email: string
}

export type RegisterResponse = {
  access: boolean
  token?: string
  id: string
  name: string
  email: string
  password: string
  apiKey: string
  llmProvider: AiProvider
  createdAt: string
  summaries: SummaryResponse[]
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
  llmProvider: string
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  pageSize: number
}
