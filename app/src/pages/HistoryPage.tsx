import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Clock, Search, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { PageTransition } from '@/components/layout/PageTransition'
import { useHistory, useDeleteSummary } from '@/hooks/useHistory'
import { timeAgo } from '@/utils/formatters'
import { toast } from 'sonner'

export function HistoryPage() {
  const { t, i18n } = useTranslation()
  const [search, setSearch] = useState('')
  const skeletonKeys = Array.from({ length: 3 }, (_, i) => `skeleton-${i}`)
  const { data, isLoading, isError } = useHistory()
  const deleteSummary = useDeleteSummary()

  const handleDelete = (id: string) => {
    deleteSummary.mutate(id, {
      onSuccess: () => toast.success(t('errors.generic')),
      onError: () => toast.error(t('errors.network')),
    })
  }

  return (
    <PageTransition>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-heading text-2xl font-bold">{t('history.title')}</h1>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('history.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {skeletonKeys.map((key) => (
              <Skeleton key={key} className="h-24 w-full" />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            icon={<Clock className="size-12" />}
            title={t('errors.network')}
          />
        ) : data && data.data.length > 0 ? (
          <div className="flex flex-col gap-4">
            {data.data
              .filter((item) =>
                item.title.toLowerCase().includes(search.toLowerCase()),
              )
              .map((item) => (
                <Card key={item.id}>
                  <CardContent className="flex items-center gap-4 py-4">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-16 w-24 flex-shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {timeAgo(item.createdAt, i18n.language)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/summarize?id=${item.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        aria-label="Delete summary"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <EmptyState
            icon={<Clock className="size-12" />}
            title={t('history.empty')}
            action={
              <Link to="/summarize">
                <Button>{t('home.cta')}</Button>
              </Link>
            }
          />
        )}
      </div>
    </PageTransition>
  )
}
