import axios from 'axios'
import i18n from '@/lib/i18n'

const API_URL = import.meta.env.VITE_API_URL as string | undefined
const BYPASS_TOKEN = import.meta.env.VITE_VERCEL_BYPASS_TOKEN as string | undefined

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  params: BYPASS_TOKEN ? { 'x-vercel-protection-bypass': BYPASS_TOKEN } : undefined,
})

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
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
