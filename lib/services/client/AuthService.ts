"use client"

import { XtreamAuthService } from '@/lib/services/api/XtreamAuthService'

export class AuthService {
  static async login(credentials: { username: string; password: string; url: string }) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...credentials,
        url: XtreamAuthService.normalizeUrl(credentials.url)
      })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Login failed')
    }

    return response.json()
  }

  static async logout() {
    const response = await fetch('/api/auth/logout', { method: 'POST' })
    if (!response.ok) {
      throw new Error('Logout failed')
    }
  }

  static async verify(credentials: { username: string; password: string; url: string }) {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...credentials,
        url: XtreamAuthService.normalizeUrl(credentials.url)
      })
    })

    if (!response.ok) {
      throw new Error('Verification failed')
    }

    return response.json()
  }
}