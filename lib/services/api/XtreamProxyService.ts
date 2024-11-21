import { NextResponse } from 'next/server'
import { CORS_HEADERS, API_USER_AGENT, ALLOWED_HOSTS } from '@/lib/config/constants'

export class XtreamProxyService {
  static async proxyRequest(url: string): Promise<Response> {
    // Validate URL and host
    try {
      const urlObj = new URL(url)
      if (!ALLOWED_HOSTS.includes(urlObj.hostname)) {
        throw new Error('Invalid host')
      }

      // Forward request to Xtream server
      const response = await fetch(url, {
        headers: {
          'Accept': '*/*',
          'User-Agent': API_USER_AGENT
        }
      })

      if (!response.ok) {
        throw new Error(`Upstream server error: ${response.status}`)
      }

      // Get response data and content type
      const data = await response.arrayBuffer()
      const contentType = response.headers.get('content-type')
      const headers = new Headers(CORS_HEADERS)
      
      if (contentType) {
        headers.set('Content-Type', contentType)
      }

      return new NextResponse(data, { headers })
    } catch (error) {
      console.error('Proxy error:', error)
      throw error instanceof Error ? error : new Error('Proxy request failed')
    }
  }
}