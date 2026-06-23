import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSummaryBySlug, deleteSummary } from '@/api/youtube'
import { getHistory } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'

export function useHistory() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['history', user?.id],
    queryFn: () => getHistory(user!.id),
    enabled: !!user?.id,
  })
}

export function useSummaryDetail(slug: string | undefined) {
  return useQuery({
    queryKey: ['summary', slug],
    queryFn: () => getSummaryBySlug(slug!),
    enabled: !!slug,
  })
}

export function useDeleteSummary() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSummary,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['history'] }),
  })
}
