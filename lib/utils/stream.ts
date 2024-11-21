import { ALLOWED_HOSTS } from '@/lib/config/constants'

export function validateStreamUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return ALLOWED_HOSTS.includes(urlObj.hostname)
  } catch {
    return false
  }
}

export function getHlsPlaylistUrl(baseUrl: string, username: string, password: string, streamId: number): string {
  return `${baseUrl}/live/${username}/${password}/${streamId}.m3u8`
}