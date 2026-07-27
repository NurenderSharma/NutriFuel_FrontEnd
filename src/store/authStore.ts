import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from '../lib/apiClient'

export type UserRole = 'customer' | 'restaurant_owner' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  emailVerified: boolean
  rewardPoints: number
  lifetimePoints: number
  rewardTier: string
  dietaryPreference: 'veg' | 'nonveg' | 'vegan'
  allergies: string[]
  weight?: number
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
  emailNotificationsEnabled: boolean
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

interface RegisterResult {
  user: AuthUser
  devVerificationLink?: string
}

interface AuthStore {
  user: AuthUser | null
  status: AuthStatus
  fetchMe: () => Promise<void>
  login: (email: string, password: string) => Promise<AuthUser>
  register: (name: string, email: string, password: string) => Promise<RegisterResult>
  logout: () => Promise<void>
  setUser: (user: AuthUser) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      status: 'idle',

      fetchMe: async () => {
        set({ status: 'loading' })
        try {
          const user = await apiClient.get<AuthUser>('/auth/me')
          set({ user, status: 'authenticated' })
        } catch {
          set({ user: null, status: 'unauthenticated' })
        }
      },

      login: async (email, password) => {
        const { user } = await apiClient.post<{ user: AuthUser }>('/auth/login', { email, password })
        set({ user, status: 'authenticated' })
        return user
      },

      register: async (name, email, password) => {
        const result = await apiClient.post<RegisterResult>('/auth/register', { name, email, password })
        set({ user: result.user, status: 'authenticated' })
        return result
      },

      logout: async () => {
        await apiClient.post('/auth/logout').catch(() => undefined)
        set({ user: null, status: 'unauthenticated' })
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'nutrifuel-auth',
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
