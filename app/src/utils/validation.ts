const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
const VIDEO_ID_REGEX = /(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/

export function isValidYoutubeUrl(url: string): boolean {
  return YOUTUBE_REGEX.test(url.trim())
}

export function extractVideoId(url: string): string | null {
  const match = url.match(VIDEO_ID_REGEX)
  return match?.[1] ?? null
}

export { YOUTUBE_REGEX }
