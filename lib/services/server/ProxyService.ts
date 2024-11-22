import { NextRequest, NextResponse } from 'next/server'
import { ALLOWED_HOSTS, CORS_HEADERS } from '@/lib/config/constants'

export class ProxyService {
  static async handleRequest(request: NextRequest) {
    try {
      const url = request.nextUrl.searchParams.get('url')
      if (!url) {
        return NextResponse.json(
          { error: 'Missing URL parameter' }, 
          { status: 400, headers: CORS_HEADERS }
        )
      }

      const targetUrl = new URL(url)
      if (!ALLOWED_HOSTS.includes(targetUrl.hostname)) {
        return NextResponse.json(
          { error: 'Invalid host' }, 
          { status: 403, headers: CORS_HEADERS }
        )
      }

      const response = await fetch(url, {
        headers: {
          'Accept': '*/*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })

      // Handle JSON responses
      const contentType = response.headers.get('Content-Type')
      if (contentType?.includes('application/json')) {
        const data = await response.json()
        return NextResponse.json(data, { 
          status: response.status,
          headers: CORS_HEADERS 
        })
      }

      // Handle binary/stream responses
      return new NextResponse(response.body, {
        status: response.status,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': contentType || 'application/octet-stream'
        }
      })
    } catch (error) {
      console.error('Proxy error:', error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Proxy request failed' },
        { status: 500, headers: CORS_HEADERS }
      )
    }
  }

  static handleCorsRequest() {
    return NextResponse.json(null, { 
      status: 204, 
      headers: CORS_HEADERS 
    })
  }
}