import { ProxyAPI } from '@/lib/api/proxy'
import type { AuthResponse } from '@/types/xtream'

export class XtreamAuthService {
  static async authenticate(url: string, username: string, password: string): Promise<AuthResponse> {
    const baseUrl = this.normalizeUrl(url)
    const apiUrl = `${baseUrl}/player_api.php?username=${username}&password=${password}`
    return ProxyAPI.fetch<AuthResponse>(apiUrl)
  }

  static normalizeUrl(url: string): string {
    const trimmedUrl = url.trim().replace(/\/+$/, '')
    return /^https?:\/\//i.test(trimmedUrl) ? trimmedUrl : `http://${trimmedUrl}`
  }
}