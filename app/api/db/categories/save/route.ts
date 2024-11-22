import { NextResponse } from 'next/server'
import { CategoryService } from '@/lib/services/server/CategoryService'
import { CORS_HEADERS } from '@/lib/config/api'

export async function POST(request: Request) {
  try {
    const { categories, serverId } = await request.json()

    if (!serverId || !Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    await CategoryService.saveCategories(categories, serverId)
    return NextResponse.json({ success: true }, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Failed to save categories:', error)
    return NextResponse.json(
      { error: 'Failed to save categories' },
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