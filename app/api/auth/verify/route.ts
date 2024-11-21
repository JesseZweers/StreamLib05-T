import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/server/AuthService'

export async function POST(request: Request) {
  try {
    const credentials = await request.json()
    const result = await AuthService.verify(credentials)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Verification failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Verification failed' },
      { status: 500 }
    )
  }
}