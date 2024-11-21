import { NextResponse } from 'next/server'
import { SyncService } from '@/lib/services/server/SyncService'

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')
    const { credentials } = await request.json()

    if (!serverId || !credentials) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const result = await SyncService.syncServerData(parseInt(serverId), credentials)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to sync data:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync data' },
      { status: 500 }
    )
  }
}