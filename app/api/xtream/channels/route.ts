import { NextResponse } from 'next/server'
import { XtreamChannelService } from '@/lib/services/api/XtreamChannelService'
import { CORS_HEADERS } from '@/lib/config/constants'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    
    if (!url) {
      throw new Error('Missing URL parameter')
    }

    const channels = await XtreamChannelService.fetchFromApi(url)
    return NextResponse.json(channels, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Channels error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch channels' },
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