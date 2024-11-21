export function normalizeUrl(url: string): string {
  const normalizedUrl = url.trim().replace(/\/+$/, '')
  return /^https?:\/\//i.test(normalizedUrl) ? normalizedUrl : `http://${normalizedUrl}`
}

export function getStreamUrl(baseUrl: string, username: string, password: string, streamId: number): string {
  return `${baseUrl}/live/${username}/${password}/${streamId}.m3u8`
}