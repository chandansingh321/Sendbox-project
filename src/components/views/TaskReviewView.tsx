import React from 'react'
import { useReview } from '../../context/ReviewContext'
import { TaskFieldRow } from './TaskFieldRow'
import { ArrowLeft, Save, Check } from 'lucide-react'

export const TaskReviewView: React.FC = () => {
  const { currentTask, queues, setView, saveDraft, completeTask, isFieldCompleted } = useReview()

  if (!currentTask) {
    return (
      <div className="w-full max-w-[1600px] 2xl:max-w-[1720px] mx-auto p-6 sm:p-8 text-center bg-white border border-gray-300 rounded shadow-sm">
        <p className="text-sm text-gray-600 mb-4">No task is currently open.</p>
        <button
          type="button"
          onClick={() => setView('assignments')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer"
        >
          Go to Assignments
        </button>
      </div>
    )
  }

  const queue = queues.find((q) => q.id === currentTask.queueId)
  const completedCount = currentTask.fields.filter(isFieldCompleted).length
  const totalCount = currentTask.fields.length
  const allCompleted = completedCount === totalCount

  return (
    <div className="w-full max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
      {/* Back button and Task Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 sm:mb-4">
        <button
          type="button"
          onClick={() => setView('assignments')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 font-medium cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assignments</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-800 bg-gray-200/80 px-2.5 py-1 rounded">
            {queue ? queue.job : currentTask.name}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded border ${
              allCompleted
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {completedCount} of {totalCount} fields reviewed
          </span>
        </div>
      </div>

      {/* Main Review Table Card */}
      <div className="w-full bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden">
        {/* Table Header Bar for Desktop/Tablet */}
        <div className="hidden md:flex bg-gray-50/50 border-b border-gray-200 text-xs text-gray-700 h-10 items-center">
          <div className="w-[35%] px-4 font-bold underline decoration-gray-400 underline-offset-2">
            Current
          </div>
          <div className="w-[35%] px-4 border-l border-gray-200 font-bold underline decoration-gray-400 underline-offset-2">
            Proposed
          </div>
          <div className="decision-separator h-full"></div>
          <div className="w-[30%] px-4 font-bold underline decoration-gray-400 underline-offset-2">
            Decision
          </div>
        </div>

        {/* Rows */}
        <div className="flex flex-col">
          {currentTask.fields.map((field) => (
            <TaskFieldRow key={field.id} taskId={currentTask.id} field={field} />
          ))}
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-white flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-t border-gray-200">
          <div className="text-xs font-medium">
            {allCompleted ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 stroke-[2.5]" /> All {totalCount} fields reviewed — ready to submit
              </span>
            ) : (
              <span className="text-gray-500">
                All fields are required ({completedCount} of {totalCount} reviewed)
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:space-x-3">
            <button
              type="button"
              onClick={saveDraft}
              className="w-full sm:w-auto justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save draft</span>
            </button>
            <button
              type="button"
              onClick={completeTask}
              className="w-full sm:w-auto justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Complete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
