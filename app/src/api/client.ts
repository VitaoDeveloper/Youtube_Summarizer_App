import axios from 'axios'
import i18n from '@/lib/i18n'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string | undefined,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  response => response,
  (error: unknown) => {
    const axiosError = error as { response?: { data?: { message?: string } } }
    const message = axiosError.response?.data?.message ?? i18n.t('errors.network')
    return Promise.reject(new Error(message))
  },
)

export { apiClient }
