import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import type { ApiEnvelope, ApiMeta } from '@/types'

const baseURL = import.meta.env.VITE_API_URL || '/api/v1'

export const http = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

const ACCESS_TOKEN_KEY = 'sgl.accessToken'

export const tokenStore = {
  get: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  set: (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  clear: () => localStorage.removeItem(ACCESS_TOKEN_KEY),
}

http.interceptors.request.use((config) => {
  const token = tokenStore.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshPromise: Promise<string | null> | null = null

const refreshAccessToken = async (): Promise<string | null> => {
  refreshPromise ??= axios
    .post<ApiEnvelope<{ accessToken: string }>>(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true })
    .then((response) => {
      const token = response.data.data?.accessToken ?? null
      if (token) tokenStore.set(token)
      return token
    })
    .catch(() => {
      tokenStore.clear()
      return null
    })
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retried?: boolean }) | undefined
    const isAuthCall = original?.url?.includes('/auth/')
    if (error.response?.status === 401 && original && !original._retried && !isAuthCall) {
      original._retried = true
      const token = await refreshAccessToken()
      if (token) {
        original.headers = { ...original.headers, Authorization: `Bearer ${token}` }
        return http.request(original)
      }
      window.dispatchEvent(new CustomEvent('sgl:session-expired'))
    }
    return Promise.reject(error)
  },
)

export interface Paged<T> {
  items: T[]
  meta: ApiMeta
}

export const unwrap = async <T>(promise: Promise<{ data: ApiEnvelope<T> }>): Promise<T> => {
  const response = await promise
  return response.data.data as T
}

export const unwrapPaged = async <T>(promise: Promise<{ data: ApiEnvelope<T[]> }>): Promise<Paged<T>> => {
  const response = await promise
  return { items: response.data.data ?? [], meta: response.data.meta ?? {} }
}

export const errorMessage = (error: unknown, fallback = 'Something went wrong. Please try again.'): string => {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiEnvelope<unknown> | undefined
    const firstFieldError = Array.isArray(body?.errors)
      ? (body?.errors[0] as { msg?: string; path?: string } | undefined)
      : undefined
    if (firstFieldError?.msg) {
      return firstFieldError.path ? `${firstFieldError.path}: ${firstFieldError.msg}` : firstFieldError.msg
    }
    if (body?.message) return body.message
    if (error.code === 'ERR_NETWORK') return 'Cannot reach the server. Check that the API is running.'
  }
  return fallback
}
