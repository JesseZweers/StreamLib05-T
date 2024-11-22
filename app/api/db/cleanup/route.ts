import { NextResponse } from 'next/server'
import { DatabaseManager } from '@/lib/database/DatabaseManager'

export async function GET() {
  const db = DatabaseManager.getInstance()
  
  try {
    // Disable foreign key checks temporarily
    await db.query('SET FOREIGN_KEY_CHECKS = 0')
    
    // Truncate all tables
    await db.query('TRUNCATE TABLE channels')
    await db.query('TRUNCATE TABLE categories')
    await db.query('TRUNCATE TABLE credentials')
    await db.query('TRUNCATE TABLE servers')
    
    // Re-enable foreign key checks
    await db.query('SET FOREIGN_KEY_CHECKS = 1')
    
    return NextResponse.json({ message: 'Database cleared successfully' })
  } catch (error) {
    console.error('Failed to clear database:', error)
    return NextResponse.json(
      { error: 'Failed to clear database' },
      { status: 500 }
    )
  }
}