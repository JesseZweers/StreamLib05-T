import { NextResponse } from 'next/server'
import { CORS_HEADERS, API_USER_AGENT } from '@/lib/config/constants'
import { validateStreamUrl } from '@/lib/utils/stream'

export class StreamService {
  static async proxyStream(url: string): Promise<Response> {
    // Validate URL and host
    if (!validateStreamUrl(url)) {
      throw new Error('Invalid stream URL')
    }

    // Forward request to stream server
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
  }

  static handleCorsRequest(): Response {
    return new NextResponse(null, { 
      status: 204, 
      headers: CORS_HEADERS 
    })
  }
}