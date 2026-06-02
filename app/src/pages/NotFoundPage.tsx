import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/layout/PageTransition'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <h1 className="font-heading text-4xl font-bold">{t('notFound.title')}</h1>
        <Link to="/">
          <Button variant="link">{t('notFound.link')}</Button>
        </Link>
      </div>
    </PageTransition>
  )
}
