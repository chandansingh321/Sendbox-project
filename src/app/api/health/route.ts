import { NextResponse } from 'next/server'
import { isMongoConfigured, getMongoDb } from '@/lib/mongodb'

export async function GET() {
  let mongoStatus = 'Not Configured'
  let mongoLatencyMs = 0
  let collections: string[] = []

  if (isMongoConfigured) {
    try {
      const start = Date.now()
      const db = await getMongoDb()
      await db.command({ ping: 1 })
      mongoLatencyMs = Date.now() - start
      mongoStatus = 'Connected'
      const cols = await db.listCollections().toArray()
      collections = cols.map((c) => c.name)
    } catch (err: any) {
      mongoStatus = `Error: ${err.message}`
    }
  }

  return NextResponse.json({
    status: 'ok',
    database: 'MongoDB Atlas',
    framework: 'Next.js 16 (App Router)',
    timestamp: new Date().toISOString(),
    mongodbAtlas: {
      isConfigured: isMongoConfigured,
      status: mongoStatus,
      latencyMs: mongoLatencyMs,
      databaseName: 'rapid_review',
      collections,
    },
  })
}
