import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { http, tokenStore, unwrap } from '@/lib/api'
import type { AuthUser } from '@/types'

interface Credentials {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

interface AuthSession {
  user: AuthUser
  accessToken: string
}

interface AuthState {
  user: AuthUser | null
  hydrated: boolean
  login: (credentials: Credentials) => Promise<AuthUser>
  register: (payload: RegisterPayload) => Promise<AuthUser>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hydrated: false,
      login: async (credentials) => {
        const session = await unwrap<AuthSession>(http.post('/auth/login', credentials))
        tokenStore.set(session.accessToken)
        set({ user: session.user })
        return session.user
      },
      register: async (payload) => {
        const session = await unwrap<AuthSession>(http.post('/auth/register', payload))
        tokenStore.set(session.accessToken)
        set({ user: session.user })
        return session.user
      },
      logout: async () => {
        try {
          await http.post('/auth/logout')
        } finally {
          tokenStore.clear()
          set({ user: null })
        }
      },
      refreshProfile: async () => {
        if (!tokenStore.get()) return
        try {
          const profile = await unwrap<AuthUser & { _id: string }>(http.get('/users/me'))
          set({ user: { ...profile, id: profile._id ?? profile.id } })
        } catch {
          tokenStore.clear()
          set({ user: null })
        }
      },
      clearSession: () => {
        tokenStore.clear()
        set({ user: null })
      },
    }),
    {
      name: 'sgl.auth',
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.refreshProfile()
        useAuthStore.setState({ hydrated: true })
      },
    },
  ),
)

export const isStaff = (role?: string): boolean => role === 'admin' || role === 'sales'
