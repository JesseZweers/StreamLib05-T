import { NextResponse } from 'next/server'
import { CORS_HEADERS, API_USER_AGENT, ALLOWED_HOSTS } from '@/lib/config/constants'

export class XtreamProxyService {
  static async proxyRequest(url: string): Promise<Response> {
    try {
      // Ensure we have a valid URL
      const targetUrl = decodeURIComponent(url)
      const urlObj = new URL(targetUrl)

      // Validate host
      if (!ALLOWED_HOSTS.includes(urlObj.hostname)) {
        throw new Error(`Invalid host: ${urlObj.hostname}`)
      }

      // Forward request to Xtream server
      const response = await fetch(targetUrl, {
        headers: {
          'Accept': '*/*',
          'User-Agent': API_USER_AGENT
        }
      })

      if (!response.ok) {
        throw new Error(`Upstream server error: ${response.status}`)
      }

      // Get response data and content type
      const contentType = response.headers.get('content-type')
      const headers = new Headers(CORS_HEADERS)
      
      if (contentType) {
        headers.set('Content-Type', contentType)
      }

      // Handle JSON responses
      if (contentType?.includes('application/json')) {
        const data = await response.json()
        return NextResponse.json(data, { headers })
      }

      // Handle binary/text responses
      const data = await response.arrayBuffer()
      return new NextResponse(data, { headers })
    } catch (error) {
      console.error('Proxy error:', error)
      throw error instanceof Error ? error : new Error('Proxy request failed')
    }
  }
}