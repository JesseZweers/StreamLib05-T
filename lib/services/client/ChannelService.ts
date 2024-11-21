"use client"

import type { Channel } from '@/types/xtream'

export class ChannelService {
  static async getChannels(serverId: number, categoryId?: string): Promise<Channel[]> {
    const url = `/api/db/channels?serverId=${serverId}${categoryId ? `&categoryId=${categoryId}` : ''}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Failed to fetch channels')
    }
    
    return response.json()
  }

  static async searchChannels(serverId: number, query: string): Promise<Channel[]> {
    if (!query || query.length < 2) return []

    const response = await fetch(
      `/api/db/channels/search?serverId=${serverId}&query=${encodeURIComponent(query)}`
    )
    
    if (!response.ok) {
      throw new Error('Failed to search channels')
    }
    
    return response.json()
  }

  static async saveChannels(serverId: number, channels: Channel[]): Promise<void> {
    const response = await fetch('/api/db/channels/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverId, channels })
    })

    if (!response.ok) {
      throw new Error('Failed to save channels')
    }
  }
}