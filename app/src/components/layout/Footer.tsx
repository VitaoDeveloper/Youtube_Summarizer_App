import { useTranslation } from 'react-i18next'

const currentYear = new Date().getFullYear()

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t py-6">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} {t('footer.builtWith')}</p>
      </div>
    </footer>
  )
}
