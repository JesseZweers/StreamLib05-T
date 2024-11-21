import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/services/server/DatabaseService'

export async function GET() {
  try {
    await DatabaseService.initialize()
    return NextResponse.json({ message: 'Database initialized successfully' })
  } catch (error) {
    console.error('Failed to initialize database:', error)
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    )
  }
}