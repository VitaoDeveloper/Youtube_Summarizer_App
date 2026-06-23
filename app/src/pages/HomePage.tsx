import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ListTree, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/layout/PageTransition'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  { icon: Sparkles, titleKey: 'feature1', descKey: 'feature1Desc' },
  { icon: ListTree, titleKey: 'feature2', descKey: 'feature2Desc' },
  { icon: Clock, titleKey: 'feature3', descKey: 'feature3Desc' },
] as const

export function HomePage() {
  const { t } = useTranslation()

  return (
    <PageTransition>
    <div className="flex flex-col items-center gap-16 py-16">
      <motion.section
        className="flex flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="max-w-2xl font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          {t('home.title')}
        </h1>
        <p className="max-w-lg text-muted-foreground">
          {t('home.subtitle')}
        </p>
        <Link to="/summarize">
          <Button size="lg">{t('home.cta')}</Button>
        </Link>
      </motion.section>

      <section className="grid w-full max-w-4xl gap-6 sm:grid-cols-3">
        {features.map(({ icon: Icon, titleKey, descKey }, index) => (
          <motion.div
            key={titleKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
          >
            <Card className="h-full">
              <CardHeader>
                <Icon className="mb-2 size-8 text-primary" />
                <CardTitle>{t(`home.${titleKey}`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t(`home.${descKey}`)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>
    </div>
    </PageTransition>
  )
}
