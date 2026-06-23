import { useRef } from 'react'
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
import { PageTransition } from '@/components/layout/PageTransition'
import { SummaryContent } from '@/components/summary/SummaryContent'
import { isValidYoutubeUrl } from '@/utils/validation'
import { useSummarize } from '@/hooks/useSummarize'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useAuth } from '@/context/AuthContext'
import { Video, AlertCircle } from 'lucide-react'

const schema = z.object({
  url: z.string().min(1, 'errors.required').refine(isValidYoutubeUrl, 'errors.invalidUrl'),
})

type FormData = z.infer<typeof schema>

export function SummarizePage() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const summarize = useSummarize()
  const formRef = useRef<HTMLFormElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    resetField,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    if (!user) return

    summarize.mutate(
      {
        videoUrl: data.url,
        userId: user.id,
        length: 'medium',
        language: i18n.language,
      },
      {
        onSuccess: () => {
          toast.success(t('summary.success'))
        },
        onError: (err: Error) => {
          toast.error(err.message)
        },
      },
    )
  }

  useKeyboard({
    'Ctrl+Enter': () => { formRef.current?.requestSubmit() },
    'Escape': () => { setValue('url', ''); resetField('url') },
  })

  const thumbnailUrl = summarize.data?.videoId
    ? `https://i.ytimg.com/vi/${summarize.data.videoId}/hqdefault.jpg`
    : null

  return (
    <PageTransition>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <Card>
          <CardHeader>
            <CardTitle>{t('summary.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={(e) => { void handleSubmit(onSubmit)(e) }} className="flex flex-col gap-4">
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
              <Button type="submit" disabled={summarize.isPending}>
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
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : summarize.data ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  {thumbnailUrl && (
                    <img
                      src={thumbnailUrl}
                      alt={summarize.data.videoTitle}
                      className="h-20 w-32 rounded object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{summarize.data.videoTitle}</h3>
                  </div>
                </div>
                <SummaryContent content={summarize.data.summary} />
                <div>
                  <h4 className="mb-2 font-medium">{t('summary.keyPoints')}</h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {summarize.data.topics.map((topic) => (
                      <li key={topic}>{topic}</li>
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
    </PageTransition>
  )
}
