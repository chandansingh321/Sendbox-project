import { NextRequest, NextResponse } from 'next/server'
import { isMongoConfigured, getMongoDb } from '@/lib/mongodb'

export async function GET() {
  if (!isMongoConfigured) {
    return NextResponse.json({
      data: [],
      source: 'local',
      mongoConnected: false,
      message: 'MongoDB Atlas is not configured in .env.local',
    })
  }

  try {
    const db = await getMongoDb()
    const docs = await db
      .collection('queues')
      .find({
        $or: [
          { slug: 'q-hume' },
          { id: 'q-hume' },
          { job: { $regex: 'Hume', $options: 'i' } },
        ],
      })
      .toArray()
    let queues = docs.map((doc) => ({
      id: doc.slug || doc.id || doc._id.toString(),
      job: doc.job,
      role: doc.role || 'Reviewer',
      isActive: doc.isActive !== false,
      created_at: doc.createdAt || doc.created_at,
    }))

    if (queues.length === 0) {
      queues = [
        {
          id: 'q-hume',
          job: '[Hume] Unreliable Sensitive Assertions Review',
          role: 'Reviewer',
          isActive: true,
          created_at: new Date().toISOString(),
        },
      ]
    }

    return NextResponse.json({
      data: queues,
      source: 'mongodb_atlas',
      mongoConnected: true,
      count: queues.length,
    })
  } catch (err: any) {
    console.error('MongoDB Atlas queues fetch error:', err)
    return NextResponse.json(
      {
        data: [],
        source: 'error',
        mongoConnected: false,
        error: err.message,
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  if (!isMongoConfigured) {
    return NextResponse.json(
      { error: 'MongoDB Atlas is not configured' },
      { status: 500 }
    )
  }

  try {
    const db = await getMongoDb()
    const body = await request.json()

    if (Array.isArray(body)) {
      const queuesColl = db.collection('queues')
      for (const q of body) {
        const slug = q.id || q.slug
        await queuesColl.updateOne(
          { slug },
          {
            $set: {
              slug,
              job: q.job,
              role: q.role || 'Reviewer',
              isActive: q.isActive !== false,
              updatedAt: new Date().toISOString(),
            },
            $setOnInsert: {
              createdAt: new Date().toISOString(),
            },
          },
          { upsert: true }
        )
      }
      return NextResponse.json({ success: true, count: body.length })
    }

    const slug = body.id || body.slug
    await db.collection('queues').updateOne(
      { slug },
      {
        $set: {
          slug,
          job: body.job,
          role: body.role || 'Reviewer',
          isActive: body.isActive !== false,
          updatedAt: new Date().toISOString(),
        },
        $setOnInsert: {
          createdAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true, slug })
  } catch (err: any) {
    console.error('MongoDB Atlas queue save error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
