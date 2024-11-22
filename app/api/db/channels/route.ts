import { NextResponse } from 'next/server'
import { ChannelService } from '@/lib/services/server/ChannelService'
import { CORS_HEADERS } from '@/lib/config/api'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')
    const categoryId = searchParams.get('categoryId')

    if (!serverId) {
      return NextResponse.json(
        { error: 'Server ID is required' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const channels = await ChannelService.getChannels(parseInt(serverId), categoryId || undefined)
    return NextResponse.json(channels || [], { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Failed to fetch channels:', error)
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
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