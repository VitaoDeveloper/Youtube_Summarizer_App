import { apiClient } from './client'
import type { SummaryResponse, SummaryRequest } from '@/types/api'

export async function postSummary(dto: SummaryRequest): Promise<SummaryResponse> {
  const { data } = await apiClient.post<SummaryResponse>('/summary', dto)
  return data
}

export async function getSummaryBySlug(slug: string): Promise<SummaryResponse> {
  const { data } = await apiClient.get<SummaryResponse>(`/summaries/${slug}`)
  return data
}

export async function deleteSummary(slug: string): Promise<void> {
  await apiClient.delete(`/summaries/${slug}`)
}
