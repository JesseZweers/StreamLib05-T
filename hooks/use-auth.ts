"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthService } from '@/lib/services/client/AuthService'

interface AuthState {
  serverId: number | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuthenticated: (serverId: number) => void
  login: (credentials: { url: string; username: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  checkAuthStatus: () => Promise<void>
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      serverId: null,
      isAuthenticated: false,
      isLoading: true,
      setAuthenticated: (serverId: number) => 
        set({ isAuthenticated: true, serverId, isLoading: false }),
      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const result = await AuthService.login(credentials)
          set({ 
            serverId: result.serverId, 
            isAuthenticated: true, 
            isLoading: false 
          })
          // Store credentials for stream URLs
          localStorage.setItem('xtream_credentials', JSON.stringify(credentials))
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      logout: async () => {
        set({ isLoading: true })
        try {
          localStorage.removeItem('xtream_credentials')
          await AuthService.logout()
          set({ serverId: null, isAuthenticated: false, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      checkAuthStatus: async () => {
        if (!get().isLoading) return

        try {
          const credentials = localStorage.getItem('xtream_credentials')
          if (!credentials) {
            set({ isAuthenticated: false, serverId: null, isLoading: false })
            return
          }

          const parsed = JSON.parse(credentials)
          const result = await AuthService.verify(parsed)
          
          if (result.isValid) {
            set({ 
              isAuthenticated: true, 
              serverId: result.serverId, 
              isLoading: false 
            })
          } else {
            set({ isAuthenticated: false, serverId: null, isLoading: false })
          }
        } catch (error) {
          console.error('Failed to check auth status:', error)
          set({ isAuthenticated: false, serverId: null, isLoading: false })
        }
      }
    }),
    {
      name: 'auth-storage',
      skipHydration: true
    }
  )
)