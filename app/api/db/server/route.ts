import { NextResponse } from 'next/server'
import { ServerService } from '@/lib/services/server/ServerService'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    const status = await ServerService.checkServerStatus(url)
    return NextResponse.json(status)
  } catch (error) {
    console.error('Failed to check server status:', error)
    return NextResponse.json(
      { error: 'Failed to check server status' },
      { status: 500 }
    )
  }
}