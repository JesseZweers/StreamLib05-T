import type { Channel } from '@/types/xtream'
import { API_USER_AGENT } from '@/lib/config/constants'

export class XtreamChannelService {
  static async fetchFromApi(url: string): Promise<Channel[]> {
    const response = await fetch(url, {
      headers: {
        'Accept': '*/*',
        'User-Agent': API_USER_AGENT
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch channels')
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  }

  static async fetchChannels(url: string, username: string, password: string): Promise<Channel[]> {
    const apiUrl = `${url}/player_api.php?username=${username}&password=${password}&action=get_live_streams`
    return this.fetchFromApi(apiUrl)
  }
}