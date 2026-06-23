# Project State — YouTube Summarizer

## Current Status
- Auth module: WORKING (Login, Register, ProtectedRoute, JWT persistence)
- Summary module: PARTIALLY IMPLEMENTED — has type mismatches and broken imports
- Backend (api/): Minimal NestJS scaffold, mostly empty

## Known Type Mismatches

### Current `types/api.ts` vs what pages expect

| Field | Type Definition | Pages Expect |
|-------|----------------|--------------|
| `SummaryResponse.thumbnail` | ❌ Missing | `SummarizePage.tsx:108` |
| `SummaryResponse.length` | `'short'\|'medium'\|'long'` (string) | `SummarizePage.tsx:115` passed to `formatDuration()` expecting `number` |
| `SummaryListItem.thumbnail` | ❌ Missing | `HistoryPage.tsx:66` |
| `SummaryListItem.title` | ❌ Has `videoTitle` instead | `HistoryPage.tsx:65` uses `item.title` |

### Broken imports

| File | Imports | Problem |
|------|---------|---------|
| `useHistory.ts:2` | `getHistory` from `@/api/youtube` | Doesn't exist there; exists in `@/api/auth` |
| `useHistory.ts:2` | `getSummaryById` from `@/api/youtube` | Doesn't exist; `getSummaryBySlug` does |
| `useSummarize.ts` | `postSummary` | ✅ Correct but signature expects `SummaryRequest`, not string |

### SummarizePage issues
- `summarize.mutate(data.url)` passes a `string` but `postSummary` expects `SummaryRequest` object
- Doesn't inject `userId` from `useAuth()`
- References `thumbnail` and `length` (typed wrong)

### HistoryPage issues
- Uses `data.data` pattern (PaginatedResponse) but actual API returns differently
- Uses `item.title` and `item.thumbnail` — wrong field names

## Documentation Sources
- `docs/07-api-integration.md` — Original API plan (mock-oriented)
- `src/api/youtube.ts` — Actual implemented endpoints
- `src/api/auth.ts` — Contains `getHistory()` via `/user/:id`
