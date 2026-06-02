import { createContext, use, useCallback, type ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { SummaryListItem } from '@/types/api'

const MAX_HISTORY = 50

interface HistoryContextType {
  history: SummaryListItem[]
  addToHistory: (item: SummaryListItem) => void
  removeFromHistory: (id: string) => void
  clearHistory: () => void
}

const HistoryContext = createContext<HistoryContextType | null>(null)

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useLocalStorage<SummaryListItem[]>('summary_history', [])

  const addToHistory = useCallback(
    (item: SummaryListItem) => {
      setHistory(prev => {
        const filtered = prev.filter(existing => existing.id !== item.id)
        return [item, ...filtered].slice(0, MAX_HISTORY)
      })
    },
    [setHistory],
  )

  const removeFromHistory = useCallback(
    (id: string) => {
      setHistory(prev => prev.filter(item => item.id !== id))
    },
    [setHistory],
  )

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [setHistory])

  return (
    <HistoryContext value={{ history, addToHistory, removeFromHistory, clearHistory }}>
      {children}
    </HistoryContext>
  )
}

export function useHistoryContext() {
  const ctx = use(HistoryContext)
  if (!ctx) throw new Error('useHistoryContext must be used within HistoryProvider')
  return ctx
}
