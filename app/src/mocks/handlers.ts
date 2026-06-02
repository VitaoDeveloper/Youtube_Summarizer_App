import { http, HttpResponse, delay } from 'msw'
import type { SummaryResponse, SummaryListItem } from '@/types/api'

const mockSummaries: SummaryResponse[] = [
  {
    id: '1',
    videoId: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    summary: 'This is a mock summary of the video. It covers the main topics discussed.',
    keyPoints: ['Point one', 'Point two', 'Point three'],
    duration: 212,
    createdAt: new Date().toISOString(),
  },
]

const mockHistory: SummaryListItem[] = mockSummaries.map(({ id, videoId, title, thumbnail, createdAt }) => ({
  id, videoId, title, thumbnail, createdAt,
}))

export const handlers = [
  http.post('/api/summaries', async ({ request }) => {
    await delay(1500)
    const { url } = await request.json() as { url: string }
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return HttpResponse.json({ message: 'Invalid YouTube URL', code: 'INVALID_URL' }, { status: 400 })
    }
    return HttpResponse.json(mockSummaries[0], { status: 201 })
  }),

  http.get('/api/summaries', async () => {
    await delay(500)
    return HttpResponse.json({ data: mockHistory, total: mockHistory.length, page: 1, pageSize: 20 })
  }),

  http.get('/api/summaries/:id', async ({ params }) => {
    await delay(500)
    const summary = mockSummaries.find(s => s.id === params.id)
    if (!summary) return HttpResponse.json({ message: 'Not found', code: 'NOT_FOUND' }, { status: 404 })
    return HttpResponse.json(summary)
  }),

  http.delete('/api/summaries/:id', async () => {
    await delay(300)
    return HttpResponse.json(null, { status: 204 })
  }),
]
