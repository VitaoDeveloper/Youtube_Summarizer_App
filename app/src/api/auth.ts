import { apiClient } from './client'
import type { AuthResponse, LoginDto, RegisterDto, User } from '@/types/api'

export async function login(dto: LoginDto): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/login', dto)
  return data
}

export async function register(dto: RegisterDto): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/register', dto)
  return data
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>('/api/auth/me')
  return data
}

export async function logout(): Promise<void> {
  await apiClient.post('/api/auth/logout')
}
