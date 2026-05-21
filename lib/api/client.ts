import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export class ApiError extends Error {
  status: number
  data: Record<string, unknown>

  constructor(message: string, status: number, data: Record<string, unknown> = {}) {
    super(message)
    this.status = status
    this.data = data
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('campously_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<{ error?: string }>) => {
    const status = error.response?.status || 500
    const data = (error.response?.data || {}) as Record<string, unknown>
    const message = data.error || error.message || 'Request failed'

    if (status === 401 && typeof window !== 'undefined') {
      const refresh = localStorage.getItem('campously_refresh')
      if (refresh && !error.config?.url?.includes('refresh-token')) {
        try {
          const { data: refreshData } = await axios.post(
            `${API_BASE}/auth/refresh-token`,
            {},
            { withCredentials: true, headers: { Authorization: `Bearer ${localStorage.getItem('campously_token')}` } }
          )
          localStorage.setItem('campously_token', refreshData.token)
          localStorage.setItem('campously_refresh', refreshData.refreshToken)
          if (error.config) {
            error.config.headers.Authorization = `Bearer ${refreshData.token}`
            return apiClient.request(error.config)
          }
        } catch {
          localStorage.removeItem('campously_token')
          localStorage.removeItem('campously_refresh')
          localStorage.removeItem('campously_user')
        }
      }
    }

    return Promise.reject(new ApiError(message.toString(), status, data))
  }
)

export async function request<T>(url: string, options?: { method?: string; data?: unknown }) {
  const res = await apiClient.request<T>({
    url,
    method: options?.method || 'GET',
    data: options?.data,
  })
  return res.data
}
