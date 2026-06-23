import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { Sun, Moon, Menu, X, LogOut, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/layout/language-switcher'

export function Header() {
  const { t } = useTranslation()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = () => {
    void logout().then(() => navigate('/'))
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-heading text-lg font-semibold">
          YT Summarizer
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {isAuthenticated ? (
            <>
              <Link to="/summarize" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.summarize')}
              </Link>
              <Link to="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.history')}
              </Link>
            </>
          ) : null}
          <div className="flex items-center gap-1">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <User className="size-4" />
                  {user?.name}
                </span>
                <Button variant="ghost" size="icon-sm" onClick={handleLogout} aria-label={t('nav.logout')}>
                  <LogOut className="size-4" />
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">{t('nav.login')}</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">{t('nav.register')}</Button>
                </Link>
              </>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={t('nav.toggleTheme')}>
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          <LanguageSwitcher />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={t('nav.toggleTheme')}>
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} aria-label={t('nav.toggleMenu')}>
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                  <User className="size-4" />
                  {user?.name}
                </div>
                <Link
                  to="/summarize"
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('nav.summarize')}
                </Link>
                <Link
                  to="/history"
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('nav.history')}
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false) }}
                  type="button"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <LogOut className="size-4" />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
