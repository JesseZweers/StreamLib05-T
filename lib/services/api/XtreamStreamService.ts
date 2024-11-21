import { API_USER_AGENT } from '@/lib/config/constants'
import { getStreamUrl } from '@/lib/utils/xtream'

export class XtreamStreamService {
  static async proxyStream(url: string): Promise<Response> {
    const response = await fetch(`/api/stream?url=${encodeURIComponent(url)}`, {
      headers: { 'User-Agent': API_USER_AGENT }
    })
    
    if (!response.ok) {
      throw new Error('Failed to proxy stream')
    }

    return response
  }

  static async proxyPlaylist(url: string): Promise<string> {
    const response = await this.proxyStream(url)
    return response.text()
  }

  static getStreamUrl = getStreamUrl
}