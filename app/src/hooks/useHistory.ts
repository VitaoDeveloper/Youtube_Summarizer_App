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
