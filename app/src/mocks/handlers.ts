import { http, HttpResponse, delay } from 'msw'
import type { SummaryResponse, SummaryListItem, AuthResponse, User, LoginDto, RegisterDto } from '@/types/api'

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

const TOKEN_PREFIX = 'mock_token_'

type StoredUser = { id: string; name: string; email: string; password: string }

function generateId(): string {
  return crypto.randomUUID()
}

const db: StoredUser[] = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password123',
  },
]

function findUserByEmail(email: string): StoredUser | undefined {
  return db.find(u => u.email === email)
}

function createToken(user: StoredUser): string {
  return `${TOKEN_PREFIX}${user.id}_${Date.now()}`
}

function decodeToken(token: string): { userId: string } | null {
  if (!token.startsWith(TOKEN_PREFIX)) return null
  const parts = token.replace(TOKEN_PREFIX, '').split('_')
  return { userId: parts[0] }
}

function sanitizeUser(user: StoredUser): User {
  const { id, name, email } = user
  return { id, name, email }
}

export const handlers = [
  http.post('/api/auth/register', async ({ request }) => {
    await delay(800)
    const body = await request.json() as RegisterDto

    if (!body.name || !body.email || !body.password) {
      return HttpResponse.json({ message: 'All fields are required', code: 'VALIDATION_ERROR' }, { status: 400 })
    }

    if (findUserByEmail(body.email)) {
      return HttpResponse.json({ message: 'Email already registered', code: 'EMAIL_TAKEN' }, { status: 409 })
    }

    if (body.password.length < 6) {
      return HttpResponse.json({ message: 'Password must be at least 6 characters', code: 'WEAK_PASSWORD' }, { status: 400 })
    }

    const user: StoredUser = {
      id: generateId(),
      name: body.name,
      email: body.email,
      password: body.password,
    }
    db.push(user)

    const token = createToken(user)
    return HttpResponse.json<AuthResponse>({ user: sanitizeUser(user), token }, { status: 201 })
  }),

  http.post('/api/auth/login', async ({ request }) => {
    await delay(600)
    const body = await request.json() as LoginDto

    if (!body.email || !body.password) {
      return HttpResponse.json({ message: 'Email and password are required', code: 'VALIDATION_ERROR' }, { status: 400 })
    }

    const user = findUserByEmail(body.email)
    if (!user || user.password !== body.password) {
      return HttpResponse.json({ message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' }, { status: 401 })
    }

    const token = createToken(user)
    return HttpResponse.json<AuthResponse>({ user: sanitizeUser(user), token })
  }),

  http.get('/api/auth/me', async ({ request }) => {
    await delay(300)
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = decodeToken(token)
    if (!decoded) {
      return HttpResponse.json({ message: 'Invalid token', code: 'INVALID_TOKEN' }, { status: 401 })
    }

    const user = db.find(u => u.id === decoded.userId)
    if (!user) {
      return HttpResponse.json({ message: 'User not found', code: 'USER_NOT_FOUND' }, { status: 401 })
    }

    return HttpResponse.json<User>(sanitizeUser(user))
  }),

  http.post('/api/auth/logout', async () => {
    await delay(200)
    return HttpResponse.json(null, { status: 204 })
  }),

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
