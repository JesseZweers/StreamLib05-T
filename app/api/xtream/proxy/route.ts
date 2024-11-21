import { NextRequest, NextResponse } from 'next/server'
import { XtreamProxyService } from '@/lib/services/api/XtreamProxyService'
import { CORS_HEADERS } from '@/lib/config/constants'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url')
    if (!url) {
      throw new Error('Missing URL parameter')
    }

    const response = await XtreamProxyService.proxyRequest(url)
    return response
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Proxy request failed' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { 
    status: 204, 
    headers: CORS_HEADERS 
  })
}