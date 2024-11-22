import { NextResponse } from 'next/server'
import { ChannelService } from '@/lib/services/server/ChannelService'
import { CORS_HEADERS } from '@/lib/config/api'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')
    const searchQuery = searchParams.get('query')

    if (!serverId || !searchQuery || searchQuery.length < 2) {
      return NextResponse.json([], { headers: CORS_HEADERS })
    }

    const channels = await ChannelService.searchChannels(parseInt(serverId), searchQuery)
    return NextResponse.json(channels || [], { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Failed to search channels:', error)
    return NextResponse.json(
      { error: 'Failed to search channels' },
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