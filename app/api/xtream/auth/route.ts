import { NextResponse } from 'next/server'
import { XtreamAuthService } from '@/lib/services/api/XtreamAuthService'
import { CORS_HEADERS } from '@/lib/config/constants'

export async function POST(request: Request) {
  try {
    const { url, username, password } = await request.json()
    
    if (!url || !username || !password) {
      throw new Error('Missing required credentials')
    }

    const authData = await XtreamAuthService.authenticate(url, username, password)
    return NextResponse.json(authData, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Authentication failed' },
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