import { NextResponse } from 'next/server'
import { ChannelService } from '@/lib/services/server/ChannelService'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')
    const searchQuery = searchParams.get('query')

    if (!serverId || !searchQuery || searchQuery.length < 2) {
      return NextResponse.json([])
    }

    const channels = await ChannelService.searchChannels(parseInt(serverId), searchQuery)
    return NextResponse.json(channels || [])
  } catch (error) {
    console.error('Failed to search channels:', error)
    return NextResponse.json(
      { error: 'Failed to search channels' },
      { status: 500 }
    )
  }
}