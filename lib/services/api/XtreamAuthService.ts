import type { AuthResponse } from '@/types/xtream'
import { API_USER_AGENT } from '@/lib/config/constants'
import { normalizeUrl } from '@/lib/utils/xtream'

export class XtreamAuthService {
  static async authenticate(url: string, username: string, password: string): Promise<AuthResponse> {
    const baseUrl = this.normalizeUrl(url)
    const apiUrl = `${baseUrl}/player_api.php?username=${username}&password=${password}`
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': '*/*',
        'User-Agent': API_USER_AGENT
      }
    })
    
    if (!response.ok) {
      throw new Error('Authentication failed')
    }

    return response.json()
  }

  static normalizeUrl = normalizeUrl
}