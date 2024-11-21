import { NextRequest, NextResponse } from 'next/server'
import { StreamService } from '@/lib/services/server/StreamService'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url')
    if (!url) {
      throw new Error('Missing URL parameter')
    }

    const response = await StreamService.proxyStream(url)
    return response
  } catch (error) {
    console.error('Stream error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Stream request failed' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return StreamService.handleCorsRequest()
}