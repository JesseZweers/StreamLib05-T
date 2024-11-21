import { NextResponse } from 'next/server'
import { XtreamCategoryService } from '@/lib/services/api/XtreamCategoryService'
import { CORS_HEADERS } from '@/lib/config/constants'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    
    if (!url) {
      throw new Error('Missing URL parameter')
    }

    const categories = await XtreamCategoryService.fetchFromApi(url)
    return NextResponse.json(categories, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Categories error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch categories' },
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