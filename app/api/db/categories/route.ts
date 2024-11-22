import { NextResponse } from 'next/server'
import { CategoryService } from '@/lib/services/server/CategoryService'
import { CORS_HEADERS } from '@/lib/config/api'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')

    if (!serverId) {
      return NextResponse.json(
        { error: 'Server ID is required' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const categories = await CategoryService.getCategories(parseInt(serverId))
    return NextResponse.json(categories || [], { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
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