import { NextResponse } from 'next/server'
import { ChannelService } from '@/lib/services/server/ChannelService'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')
    const categoryId = searchParams.get('categoryId')

    if (!serverId) {
      return NextResponse.json(
        { error: 'Server ID is required' },
        { status: 400 }
      )
    }

    const channels = await ChannelService.getChannels(parseInt(serverId), categoryId || undefined)
    return NextResponse.json(channels || [])
  } catch (error) {
    console.error('Failed to fetch channels:', error)
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
      { status: 500 }
    )
  }
}