import { NextResponse } from 'next/server'
import { CategoryService } from '@/lib/services/server/CategoryService'

export async function POST(request: Request) {
  try {
    const { categories, serverId } = await request.json()

    if (!serverId || !Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    await CategoryService.saveCategories(categories, serverId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save categories:', error)
    return NextResponse.json(
      { error: 'Failed to save categories' },
      { status: 500 }
    )
  }
}