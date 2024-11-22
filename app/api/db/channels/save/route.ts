import { NextResponse } from 'next/server'
import { ChannelService } from '@/lib/services/server/ChannelService'
import { CORS_HEADERS } from '@/lib/config/api'

export async function POST(request: Request) {
  try {
    const { channels, serverId } = await request.json()

    if (!serverId || !Array.isArray(channels)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    await ChannelService.saveChannels(channels, serverId)
    return NextResponse.json({ success: true }, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Failed to save channels:', error)
    return NextResponse.json(
      { error: 'Failed to save channels' },
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