import React from 'react'
import { useReview } from '../../context/ReviewContext'
import { ArrowLeft, Shield, CheckCircle2, XCircle, Info } from 'lucide-react'

export const AdminTaskDetailView: React.FC = () => {
  const { currentTask, queues, setView } = useReview()

  if (!currentTask) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
        <p className="text-sm text-slate-600 mb-4">That task is no longer available.</p>
        <button
          type="button"
          onClick={() => setView('admin')}
          className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl cursor-pointer"
        >
          Back to Admin Dashboard
        </button>
      </div>
    )
  }

  const queue = queues.find((q) => q.id === currentTask.queueId)
  const isCompleted = currentTask.status === 'completed'

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Top Banner */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => setView('admin')}
            className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-semibold mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-slate-900">
              {queue ? queue.job : currentTask.name}
            </h2>
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                currentTask.status === 'completed'
                  ? 'bg-blue-100 text-blue-700'
                  : currentTask.status === 'in_progress'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {currentTask.status.replace('_', ' ')}
            </span>

            {/* Evaluation Verdict Pill */}
            {currentTask.verdict && (
              <span
                className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${
                  currentTask.verdict === 'Good'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300'
                }`}
              >
                Verdict: {currentTask.verdict}
                {currentTask.score !== undefined ? ` (${currentTask.score}%)` : ''}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
            <span>Assignee: {currentTask.assignedTo || 'Unassigned'}</span>
          </div>
          {currentTask.description && (
            <div className="mt-2.5 p-2.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-xs text-blue-900 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">Task Description: </span>
                <span className="text-slate-700">{currentTask.description}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
          <Shield className="w-4 h-4 text-blue-600" />
          <span>Admin Evaluation & Audit View</span>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="px-5 py-2.5 bg-blue-50/50 border-b border-blue-100 text-xs text-blue-900 flex items-center justify-between">
        <span>
          Comparing Reviewer submitted decisions against Admin Ground Truth (Expected correct decisions).
        </span>
      </div>

      {/* Audit Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#f6f1f8] text-[#5c5366] font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4 w-[24%]">Field</th>
              <th className="py-3 px-4 w-[16%]">Current</th>
              <th className="py-3 px-4 w-[16%]">Proposed</th>
              <th className="py-3 px-4 w-[18%]">Reviewer Decision</th>
              <th className="py-3 px-4 w-[18%]">Correct (Expected)</th>
              <th className="py-3 px-4 text-center">Match</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentTask.fields.map((field) => {
              const label = field.label || field.path.split('/').pop() || 'Field'
              const userDecision = field.decision
              const userReason = field.reason
              const expDecision = field.expectedDecision
              const expReason = field.expectedReason

              const hasExp = Boolean(expDecision)
              let isMatch = true
              if (hasExp) {
                const decMatches = userDecision === expDecision
                const rMatches =
                  expDecision !== 'no_action' || !expReason || userReason === expReason
                isMatch = decMatches && rMatches
              }

              return (
                <tr key={field.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Field Name & Path */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{label}</div>
                    <div className="text-[11px] text-slate-400 font-mono break-all">
                      {field.path}
                    </div>
                    {field.description && (
                      <div className="text-[11px] text-slate-600 mt-1.5 p-1.5 bg-slate-50 border border-slate-200/70 rounded-lg italic leading-relaxed">
                        <span className="font-semibold text-slate-700 not-italic">Note: </span>
                        {field.description}
                      </div>
                    )}
                  </td>

                  {/* Current */}
                  <td className="py-3.5 px-4 text-slate-700 break-words">{field.current || '—'}</td>

                  {/* Proposed */}
                  <td className="py-3.5 px-4 text-slate-700 bg-slate-50/40 break-words">
                    {field.proposed || '—'}
                  </td>

                  {/* Reviewer Decision */}
                  <td className="py-3.5 px-4">
                    {userDecision ? (
                      <div>
                        <span
                          className={`font-bold capitalize ${
                            userDecision === 'accept' ? 'text-emerald-700' : 'text-blue-700'
                          }`}
                        >
                          {userDecision === 'no_action' ? 'No Action' : 'Accept'}
                        </span>
                        {userReason && (
                          <div className="text-[11px] text-slate-600">
                            Reason: <span className="font-medium">{userReason}</span>
                          </div>
                        )}
                        {field.note && (
                          <div className="text-[10px] text-slate-400 italic mt-0.5">
                            "{field.note}"
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No decision yet</span>
                    )}
                  </td>

                  {/* Correct Expected Ground Truth */}
                  <td className="py-3.5 px-4 bg-blue-50/20">
                    {expDecision ? (
                      <div>
                        <span
                          className={`font-bold capitalize ${
                            expDecision === 'accept' ? 'text-emerald-700' : 'text-blue-700'
                          }`}
                        >
                          {expDecision === 'no_action' ? 'No Action' : 'Accept'}
                        </span>
                        {expReason && (
                          <div className="text-[11px] text-slate-600">
                            Reason: <span className="font-medium">{expReason}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Unspecified</span>
                    )}
                  </td>

                  {/* Result Pill */}
                  <td className="py-3.5 px-4 text-center">
                    {isCompleted ? (
                      isMatch ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> Match
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3.5 h-3.5 stroke-[2.5]" /> Discrepancy
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400 italic">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
