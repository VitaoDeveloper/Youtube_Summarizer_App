import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { availableLanguages } from '@/utils/languageConfig'

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const switchLanguage = useCallback(
    (code: string) => {
      void i18n.changeLanguage(code)
      setOpen(false)
    },
    [i18n],
  )

  const currentCode = i18n.language?.split('-')[0] ?? 'en'

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label="Switch language"
      >
        <Languages className="size-5" />
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-md border bg-popover p-1 shadow-md">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                  currentCode === lang.code ? 'bg-accent font-medium' : ''
                }`}
              >
                <span className="w-6 text-center text-xs uppercase text-muted-foreground">
                  {lang.code}
                </span>
                {t(lang.i18nKey)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
