import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/server/AuthService'

export async function POST() {
  try {
    await AuthService.logout()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Logout failed' },
      { status: 500 }
    )
  }
}