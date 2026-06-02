export interface LanguageOption {
  code: string
  i18nKey: string
}

export const availableLanguages: LanguageOption[] = [
  { code: 'en', i18nKey: 'languages.en' },
  { code: 'pt', i18nKey: 'languages.pt' },
  { code: 'es', i18nKey: 'languages.es' },
]
