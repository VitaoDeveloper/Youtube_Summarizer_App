import { format, formatDistanceToNow } from 'date-fns'
import { enUS, ptBR, es } from 'date-fns/locale'
import type { Locale } from 'date-fns'

const locales: Record<string, Locale> = { en: enUS, pt: ptBR, es }

export function formatDate(iso: string, lang = 'en'): string {
  const locale = locales[lang] ?? enUS
  return format(new Date(iso), 'MMM d, yyyy – HH:mm', { locale })
}

export function timeAgo(iso: string, lang = 'en'): string {
  const locale = locales[lang] ?? enUS
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale })
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function truncateText(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max).trimEnd() + '\u2026'
}
