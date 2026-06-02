import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-heading text-lg font-semibold">
          YT Summarizer
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/summarize" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Summarize
          </Link>
          <Link to="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            History
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-2">
            <Link
              to="/summarize"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Summarize
            </Link>
            <Link
              to="/history"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              History
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
