import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/server/AuthService'

export async function POST(request: Request) {
  try {
    const credentials = await request.json()
    const result = await AuthService.login(credentials)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Login failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 500 }
    )
  }
}