import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Video, AlertCircle } from 'lucide-react'
import { useSummarize } from '@/hooks/useSummarize'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/

const schema = z.object({
  url: z.string().min(1, 'errors.required').regex(YOUTUBE_REGEX, 'errors.invalidUrl'),
})

type FormData = z.infer<typeof schema>

export function SummarizePage() {
  const { t } = useTranslation()
  const summarize = useSummarize()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    summarize.mutate(data.url, {
      onSuccess: () => {
        toast.success(t('errors.generic'))
      },
      onError: () => {
        toast.error(t('errors.network'))
      },
    })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <Card>
        <CardHeader>
          <CardTitle>{t('summary.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }} className="flex flex-col gap-4">
            <div>
              <label htmlFor="url" className="mb-2 block text-sm font-medium">
                {t('summary.inputLabel')}
              </label>
              <Input
                id="url"
                type="url"
                placeholder={t('summary.inputPlaceholder')}
                aria-invalid={!!errors.url}
                aria-describedby={errors.url ? 'url-error' : undefined}
                {...register('url')}
              />
              {errors.url && (
                <p id="url-error" className="mt-1 text-sm text-destructive">
                  {t(errors.url.message as string)}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting || summarize.isPending}>
              {summarize.isPending ? t('summary.submitting') : t('summary.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('summary.keyPoints')}</CardTitle>
        </CardHeader>
        <CardContent>
          {summarize.isPending ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : summarize.data ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={summarize.data.thumbnail}
                  alt={summarize.data.title}
                  className="h-20 w-32 rounded object-cover"
                />
                <div>
                  <h3 className="font-semibold">{summarize.data.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('summary.duration')}: {summarize.data.duration}s
                  </p>
                </div>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {summarize.data.summary}
                </ReactMarkdown>
              </div>
              <div>
                <h4 className="mb-2 font-medium">{t('summary.keyPoints')}</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {summarize.data.keyPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : summarize.isError ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <AlertCircle className="size-12 text-destructive" />
              <p className="text-sm text-muted-foreground">{t('errors.network')}</p>
              <Button variant="outline" onClick={() => summarize.reset()}>
                {t('home.cta')}
              </Button>
            </div>
          ) : (
            <EmptyState
              icon={<Video className="size-12" />}
              title={t('summary.empty')}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
