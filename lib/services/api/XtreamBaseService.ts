import { getClientBaseUrl } from '@/lib/utils/url'

export class XtreamBaseService {
  protected static async proxyRequest<T>(url: string): Promise<T> {
    const baseUrl = getClientBaseUrl()
    const proxyUrl = new URL('/api/proxy', baseUrl)
    proxyUrl.searchParams.set('url', encodeURIComponent(url))
    
    const response = await fetch(proxyUrl.toString())
    if (!response.ok) {
      throw new Error('API request failed')
    }

    return response.json()
  }
}