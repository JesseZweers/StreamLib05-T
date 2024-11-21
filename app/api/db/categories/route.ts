import { NextResponse } from 'next/server'
import { CategoryService } from '@/lib/services/server/CategoryService'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')

    if (!serverId) {
      return NextResponse.json(
        { error: 'Server ID is required' },
        { status: 400 }
      )
    }

    const categories = await CategoryService.getCategories(parseInt(serverId))
    return NextResponse.json(categories || [])
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}