import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="font-heading text-4xl font-bold">YT Summarizer</h1>
      <p className="mt-4 text-muted-foreground">Paste a YouTube URL and get a structured summary.</p>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="summarize" element={<div className="py-8 text-center text-muted-foreground">Summarize page coming soon</div>} />
        <Route path="history" element={<div className="py-8 text-center text-muted-foreground">History page coming soon</div>} />
      </Route>
    </Routes>
  )
}

export default App
