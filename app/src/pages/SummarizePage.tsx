import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Video } from 'lucide-react'

const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/

const schema = z.object({
  url: z.string().min(1, 'errors.required').regex(YOUTUBE_REGEX, 'errors.invalidUrl'),
})

type FormData = z.infer<typeof schema>

export function SummarizePage() {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    // Will be wired to API in Prompt 7
    console.log(data)
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('summary.submitting') : t('summary.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('summary.keyPoints')}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<Video className="size-12" />}
            title={t('summary.empty')}
          />
        </CardContent>
      </Card>
    </div>
  )
}
