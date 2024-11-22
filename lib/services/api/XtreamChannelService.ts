import { ProxyAPI } from '@/lib/api/proxy'
import { XtreamAuthService } from './XtreamAuthService'
import type { Channel } from '@/types/xtream'

export class XtreamChannelService {
  static async fetchChannels(url: string, username: string, password: string): Promise<Channel[]> {
    try {
      const baseUrl = XtreamAuthService.normalizeUrl(url)
      const apiUrl = `${baseUrl}/player_api.php?username=${username}&password=${password}&action=get_live_streams`
      const channels = await ProxyAPI.fetch<Channel[]>(apiUrl)
      return Array.isArray(channels) ? channels : []
    } catch (error) {
      console.error('Failed to fetch channels:', error)
      throw error
    }
  }
}