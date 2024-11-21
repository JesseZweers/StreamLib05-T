import { NextResponse } from 'next/server'
import { XtreamAuthService } from '@/lib/services/api/XtreamAuthService'

export async function POST(request: Request) {
  try {
    const { url, username, password } = await request.json()
    const baseUrl = XtreamAuthService.normalizeUrl(url)
    
    const authData = await XtreamAuthService.authenticate(baseUrl, username, password)
    return NextResponse.json({
      isValid: !!authData.user_info?.auth
    })
  } catch (error) {
    console.error('Failed to verify credentials:', error)
    return NextResponse.json({
      isValid: false,
      error: error instanceof Error ? error.message : 'Verification failed'
    })
  }
}