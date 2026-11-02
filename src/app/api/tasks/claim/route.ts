import { NextRequest, NextResponse } from 'next/server'
import { isMongoConfigured, getMongoDb } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  if (!isMongoConfigured) {
    return NextResponse.json(
      { success: false, message: 'MongoDB Atlas is not configured' },
      { status: 500 }
    )
  }

  try {
    const { queueId, email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Reviewer email is required to claim a task' },
        { status: 400 }
      )
    }

    const db = await getMongoDb()
    const tasksColl = db.collection('tasks')

    // Restrict strictly to [Hume] Unreliable Sensitive Assertions Review queue
    const targetQueue = queueId || 'q-hume'
    const filter: Record<string, any> = {
      status: 'ready',
      $or: [
        { queueSlug: targetQueue },
        { queueId: targetQueue },
        { name: { $regex: 'Hume', $options: 'i' } },
      ],
    }

    // Atomic findOneAndUpdate prevents race conditions and duplicate assignments
    const result = await tasksColl.findOneAndUpdate(
      filter,
      {
        $set: {
          status: 'in_progress',
          workStatus: 'Active',
          assignedTo: email,
          claimedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      {
        returnDocument: 'after',
      }
    )

    if (!result) {
      return NextResponse.json({
        success: false,
        message: queueId
          ? 'No ready tasks waiting in this queue.'
          : 'All caught up! No ready tasks available.',
      })
    }

    const doc = result
    const formattedTask = {
      id: doc.taskId || doc.id || doc._id.toString(),
      queueId: doc.queueSlug || doc.queueId || queueId || 'q-hume',
      name: doc.name,
      description: doc.description || '',
      entityId: doc.entityId || '',
      status: doc.status || 'in_progress',
      workStatus: doc.workStatus || 'Active',
      assignedTo: doc.assignedTo || email,
      fields: Array.isArray(doc.fields) ? doc.fields : [],
      jobName: doc.jobName,
      roleName: doc.roleName,
      verdict: doc.verdict,
      score: doc.score,
      correctCount: doc.correctCount,
      totalCount: doc.totalCount,
      created_at: doc.createdAt || doc.created_at,
      updated_at: doc.updatedAt || doc.updated_at,
    }

    return NextResponse.json({
      success: true,
      task: formattedTask,
    })
  } catch (err: any) {
    console.error('Atomic task claim error in Atlas:', err)
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}
