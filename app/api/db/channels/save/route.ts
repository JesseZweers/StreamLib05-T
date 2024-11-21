import { NextResponse } from 'next/server'
import { ChannelService } from '@/lib/services/server/ChannelService'

export async function POST(request: Request) {
  try {
    const { channels, serverId } = await request.json()

    if (!serverId || !Array.isArray(channels)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    await ChannelService.saveChannels(channels, serverId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save channels:', error)
    return NextResponse.json(
      { error: 'Failed to save channels' },
      { status: 500 }
    )
  }
}