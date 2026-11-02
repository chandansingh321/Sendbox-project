import { NextRequest, NextResponse } from 'next/server'
import { isMongoConfigured, getMongoDb } from '@/lib/mongodb'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  if (!isMongoConfigured) {
    return NextResponse.json(
      { error: 'MongoDB Atlas is not configured' },
      { status: 500 }
    )
  }

  try {
    const db = await getMongoDb()
    const tasksColl = db.collection('tasks')

    // Find existing task in MongoDB Atlas to retrieve expected answers
    const existingDoc = await tasksColl.findOne({
      $or: [{ taskId: id }, { id }],
    })

    const updatePayload: Record<string, any> = {
      ...body,
      updatedAt: new Date().toISOString(),
    }

    if (body.queueId) {
      updatePayload.queueSlug = body.queueId
    }

    let verdict: 'Good' | 'Poor' | undefined
    let score: number | undefined
    let correctCount: number | undefined
    let totalCount: number | undefined

    // If task is being completed, evaluate user's decisions against ground truth
    if (body.status === 'completed' && Array.isArray(body.fields)) {
      const storedFields = Array.isArray(existingDoc?.fields) ? existingDoc.fields : []
      const calcTotal = body.fields.length
      let calcCorrect = 0

      // Merge fields to ensure expectedDecision / expectedReason are preserved
      const evaluatedFields = body.fields.map((userF: any) => {
        const storedF = storedFields.find((f: any) => f.id === userF.id) || {}
        const expectedDecision = storedF.expectedDecision || userF.expectedDecision || ''
        const expectedReason = storedF.expectedReason || userF.expectedReason || ''

        // Check if decision matches
        let isCorrect = false
        if (expectedDecision) {
          const decisionMatches = userF.decision === expectedDecision
          if (expectedDecision === 'no_action' && expectedReason) {
            // Require both decision and reason match
            isCorrect = decisionMatches && userF.reason === expectedReason
          } else {
            isCorrect = decisionMatches
          }
        } else {
          // If no expectedDecision is defined by admin, accept user decision as valid
          isCorrect = true
        }

        if (isCorrect) calcCorrect += 1

        return {
          ...userF,
          expectedDecision,
          expectedReason,
          isCorrect,
        }
      })

      score = calcTotal > 0 ? Math.round((calcCorrect / calcTotal) * 100) : 100
      verdict = score >= 80 ? 'Good' : 'Poor'
      correctCount = calcCorrect
      totalCount = calcTotal

      updatePayload.fields = evaluatedFields
      updatePayload.verdict = verdict
      updatePayload.score = score
      updatePayload.correctCount = correctCount
      updatePayload.totalCount = totalCount
    }

    const result = await tasksColl.updateOne(
      { $or: [{ taskId: id }, { id }] },
      { $set: updatePayload }
    )

    return NextResponse.json({
      success: true,
      id,
      database: 'MongoDB Atlas',
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      verdict,
      score,
      correctCount,
      totalCount,
    })
  } catch (err: any) {
    console.error('Error updating task in MongoDB Atlas:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
