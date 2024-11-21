export function normalizeUrl(url: string): string {
  const trimmedUrl = url.trim().replace(/\/+$/, '')
  return /^https?:\/\//i.test(trimmedUrl) ? trimmedUrl : `http://${trimmedUrl}`
}

export function getStreamUrl(baseUrl: string, username: string, password: string, streamId: number): string {
  return `${baseUrl}/live/${username}/${password}/${streamId}.m3u8`
}