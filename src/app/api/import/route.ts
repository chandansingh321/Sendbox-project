import { NextRequest, NextResponse } from 'next/server'
import { isMongoConfigured, getMongoDb } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  if (!isMongoConfigured) {
    return NextResponse.json(
      { error: 'MongoDB Atlas is not configured' },
      { status: 500 }
    )
  }

  try {
    const { queues = [], tasks = [] } = await request.json()
    const db = await getMongoDb()

    if (queues.length > 0) {
      const queuesColl = db.collection('queues')
      for (const q of queues) {
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
    }

    if (tasks.length > 0) {
      const tasksColl = db.collection('tasks')
      for (const t of tasks) {
        const taskId = t.id || t.taskId || `hume-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        const queueSlug = 'q-hume'
        const name = '[Hume] Unreliable Sensitive Assertions Review'
        await tasksColl.updateOne(
          { $or: [{ taskId }, { id: taskId }] },
          {
            $set: {
              taskId,
              id: taskId,
              queueSlug,
              name,
              description: t.description || '',
              status: t.status || 'ready',
              workStatus: t.workStatus || 'Waiting',
              assignedTo: t.assignedTo || '',
              fields: t.fields || [],
              updatedAt: new Date().toISOString(),
            },
            $setOnInsert: {
              createdAt: new Date().toISOString(),
            },
          },
          { upsert: true }
        )
      }
    }

    return NextResponse.json({
      success: true,
      database: 'MongoDB Atlas',
      queuesCount: queues.length,
      tasksCount: tasks.length,
    })
  } catch (err: any) {
    console.error('Import error to MongoDB Atlas:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
