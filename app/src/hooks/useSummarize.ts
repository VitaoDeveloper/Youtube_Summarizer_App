import { useMutation } from '@tanstack/react-query'
import { postSummary } from '@/api/youtube'

export function useSummarize() {
  return useMutation({
    mutationFn: postSummary,
  })
}
