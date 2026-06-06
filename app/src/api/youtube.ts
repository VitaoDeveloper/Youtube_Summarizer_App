import { apiClient } from './client'
import type { SummaryListItem, SummaryResponse, PaginatedResponse } from '@/types/api'

export async function postSummary(videoUrl: string): Promise<SummaryResponse> {
  const { data } = await apiClient.post<SummaryResponse>('/summaries', { url: videoUrl })
  return data
}

export async function getHistory(page = 1, pageSize = 20): Promise<PaginatedResponse<SummaryListItem>> {
  const { data } = await apiClient.get<PaginatedResponse<SummaryListItem>>('/summaries', { params: { page, pageSize } })
  return data
}

export async function getSummaryById(id: string): Promise<SummaryResponse> {
  const { data } = await apiClient.get<SummaryResponse>(`/summaries/${id}`)
  return data
}

export async function deleteSummary(id: string): Promise<void> {
  await apiClient.delete(`/summaries/${id}`)
}
