"use client"

import type { ServerStatus } from '@/types/api'

export class ServerService {
  static async checkServer(url: string): Promise<ServerStatus> {
    const response = await fetch(`/api/db/server?url=${encodeURIComponent(url)}`)
    if (!response.ok) {
      throw new Error('Failed to check server')
    }
    return response.json()
  }

  static async createOrUpdateServer(url: string): Promise<{ id: number }> {
    const response = await fetch('/api/db/server', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })

    if (!response.ok) {
      throw new Error('Failed to create/update server')
    }

    return response.json()
  }
}