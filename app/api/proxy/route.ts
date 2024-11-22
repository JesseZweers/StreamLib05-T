import { NextRequest, NextResponse } from 'next/server'
import { ProxyAPI } from '@/lib/api/proxy'
import { CORS_HEADERS } from '@/lib/config/constants'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url')
    if (!url) {
      return NextResponse.json(
        { error: 'Missing URL parameter' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const response = await ProxyAPI.stream(url)
    const contentType = response.headers.get('Content-Type')
    const headers = new Headers(CORS_HEADERS)

    if (contentType) {
      headers.set('Content-Type', contentType)
    }

    if (contentType?.includes('application/json')) {
      const data = await response.json()
      return NextResponse.json(data, { headers })
    }

    return new NextResponse(response.body, { headers })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Proxy request failed' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { status: 204, headers: CORS_HEADERS })
}