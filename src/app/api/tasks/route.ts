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
      .collection('tasks')
      .find({
        $or: [
          { queueSlug: 'q-hume' },
          { queueId: 'q-hume' },
          { name: { $regex: 'Hume', $options: 'i' } },
        ],
      })
      .toArray()
    const tasks = docs.map((doc) => ({
      id: doc.taskId || doc.id || doc._id.toString(),
      queueId: doc.queueSlug || doc.queueId || 'q-hume',
      name: doc.name,
      description: doc.description || '',
      entityId: doc.entityId || '',
      status: doc.status || 'ready',
      workStatus: doc.workStatus || 'Waiting',
      assignedTo: doc.assignedTo || '',
      fields: Array.isArray(doc.fields) ? doc.fields : [],
      jobName: doc.jobName,
      roleName: doc.roleName,
      verdict: doc.verdict,
      score: doc.score,
      correctCount: doc.correctCount,
      totalCount: doc.totalCount,
      created_at: doc.createdAt || doc.created_at,
      updated_at: doc.updatedAt || doc.updated_at,
    }))

    return NextResponse.json({
      data: tasks,
      source: 'mongodb_atlas',
      mongoConnected: true,
      count: tasks.length,
    })
  } catch (err: any) {
    console.error('MongoDB Atlas fetch error:', err)
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
      // Bulk upsert
      const tasksColl = db.collection('tasks')
      for (const t of body) {
        const taskId = t.id || t.taskId
        await tasksColl.updateOne(
          { taskId },
          {
            $set: {
              taskId,
              queueSlug: t.queueId || t.queueSlug,
              name: t.name,
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
      return NextResponse.json({ success: true, count: body.length })
    }

    const taskId = body.id || body.taskId
    await db.collection('tasks').updateOne(
      { taskId },
      {
        $set: {
          taskId,
          queueSlug: body.queueId || body.queueSlug,
          name: body.name,
          status: body.status || 'ready',
          workStatus: body.workStatus || 'Waiting',
          assignedTo: body.assignedTo || '',
          fields: body.fields || [],
          updatedAt: new Date().toISOString(),
        },
        $setOnInsert: {
          createdAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({ success: true, taskId })
  } catch (err: any) {
    console.error('MongoDB Atlas task save error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
