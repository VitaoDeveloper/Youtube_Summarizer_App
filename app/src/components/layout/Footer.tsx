const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} Built with React + Vite</p>
      </div>
    </footer>
  )
}
