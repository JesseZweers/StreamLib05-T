import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/server/AuthService'

export async function POST(request: Request) {
  try {
    const { credentials, authData } = await request.json()
    const result = await AuthService.storeAuthData(credentials, authData)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to store auth data:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to store auth data' },
      { status: 500 }
    )
  }
}