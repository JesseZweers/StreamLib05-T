import { ChannelRepository } from '@/lib/repositories/ChannelRepository'
import type { Channel } from '@/types/xtream'

export class ChannelService {
  static async getChannels(serverId: number, categoryId?: string): Promise<Channel[]> {
    return await ChannelRepository.getByCategory(serverId, categoryId)
  }

  static async searchChannels(serverId: number, query: string): Promise<Channel[]> {
    if (!query || query.length < 2) return []
    return await ChannelRepository.search(serverId, query)
  }

  static async saveChannels(channels: Channel[], serverId: number): Promise<void> {
    await ChannelRepository.saveBatch(channels, serverId)
  }
}