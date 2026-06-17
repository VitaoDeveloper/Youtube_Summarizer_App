import axios from 'axios'
import i18n from '@/lib/i18n'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    'x-vercel-protection-bypass': import.meta.env.VITE_VERCEL_BYPASS_TOKEN,
  },
})

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    const parsed = JSON.parse(token) as string | null
    if (parsed) {
      config.headers.Authorization = `Bearer ${parsed}`
    }
  }
  return config
})

apiClient.interceptors.response.use(
  response => response,
  (error: unknown) => {
    const axiosError = error as { response?: { data?: { message?: string } } }
    const message = axiosError.response?.data?.message ?? i18n.t('errors.network')
    return Promise.reject(new Error(message))
  },
)
