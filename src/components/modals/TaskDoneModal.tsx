import React from 'react'
import { useReview } from '../../context/ReviewContext'
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'

interface TaskDoneModalProps {
  taskId: string
  verdict?: 'Good' | 'Poor'
}

export const TaskDoneModal: React.FC<TaskDoneModalProps> = ({ taskId, verdict = 'Good' }) => {
  const { tasks, setModal, setView, startNext } = useReview()
  const item = tasks.find((t) => t.id === taskId)
  const hasNext = tasks.some((t) => t.status === 'ready')

  const isGood = verdict === 'Good'

  const handleBackToAssignments = () => {
    setModal(null)
    setView('assignments')
  }

  const handleStartNext = () => {
    startNext(item?.queueId)
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-center">
        {/* Large Result Icon */}
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isGood
              ? 'bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50'
              : 'bg-rose-100 text-rose-600 ring-8 ring-rose-50'
          }`}
        >
          {isGood ? (
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          ) : (
            <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
          )}
        </div>

        {/* Verdict Badge */}
        <div className="inline-block mb-3">
          <span
            className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-2xs ${
              isGood
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-rose-100 text-rose-800 border-rose-300'
            }`}
          >
            Result: {verdict}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900">
          {isGood ? 'Evaluation Passed!' : 'Evaluation Needs Review'}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed px-2">
          {isGood ? (
            <>
              Great job! Your review for{' '}
              <strong className="text-slate-800">{item?.name || 'this task'}</strong> was
              evaluated as <strong className="text-emerald-700">Good</strong>.
            </>
          ) : (
            <>
              Your review for{' '}
              <strong className="text-slate-800">{item?.name || 'this task'}</strong> was
              evaluated as <strong className="text-rose-700">Poor</strong>. Please pay closer
              attention to the guidelines on upcoming tasks.
            </>
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mt-6 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleBackToAssignments}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
          >
            Back to assignments
          </button>
          {hasNext && (
            <button
              type="button"
              onClick={handleStartNext}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Start next task</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
