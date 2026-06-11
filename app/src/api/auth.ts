import { apiClient } from './client'
import type { AuthResponse, LoginDto, RegisterDto, UserResponse } from '@/types/api'

export async function login(dto: LoginDto): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', dto)
  return data
}

export async function register(dto: RegisterDto): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/user', dto)
  return data
}

export async function getMe(id: string): Promise<UserResponse> {
  const { data } = await apiClient.get<UserResponse>(`/user/${id}`)
  return data
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}
