"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { XtreamAuthService } from '@/lib/services/api/XtreamAuthService'
import { ServerService } from '@/lib/services/client/ServerService'

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
          // Normalize URL
          const normalizedUrl = XtreamAuthService.normalizeUrl(credentials.url)
          const normalizedCredentials = { ...credentials, url: normalizedUrl }

          // Store raw credentials for stream URLs
          localStorage.setItem('xtream_credentials', JSON.stringify(normalizedCredentials))

          // Authenticate with server
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(normalizedCredentials)
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Login failed')
          }

          const { serverId } = await response.json()
          set({ serverId, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      logout: async () => {
        set({ isLoading: true })
        try {
          localStorage.removeItem('xtream_credentials')
          await fetch('/api/auth/logout', { method: 'POST' })
          set({ serverId: null, isAuthenticated: false, isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      checkAuthStatus: async () => {
        if (!get().isLoading) return // Skip if already checked

        try {
          const credentials = localStorage.getItem('xtream_credentials')
          if (!credentials) {
            set({ isAuthenticated: false, serverId: null, isLoading: false })
            return
          }

          const { url } = JSON.parse(credentials)
          const serverInfo = await ServerService.checkServer(url)
          
          if (serverInfo.exists && serverInfo.isReady) {
            set({ isAuthenticated: true, serverId: serverInfo.id, isLoading: false })
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