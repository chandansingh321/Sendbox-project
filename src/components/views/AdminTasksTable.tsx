import React from 'react'
import { useReview } from '../../context/ReviewContext'
import { ExternalLink } from 'lucide-react'

export const AdminTasksTable: React.FC = () => {
  const { tasks, queues, adminFilter, openAdminTask } = useReview()

  const rows = tasks.filter((t) => t.status === adminFilter)

  const getQueue = (queueId: string) => queues.find((q) => q.id === queueId)

  const filterLabel =
    adminFilter === 'ready'
      ? 'Ready'
      : adminFilter === 'in_progress'
      ? 'In Progress'
      : 'Completed'

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">{filterLabel} Tasks</h3>
        <span className="text-xs text-slate-400 font-medium">
          {rows.length} {rows.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
              <th className="py-3 px-4">Job</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Assignee</th>
              {adminFilter === 'completed' && <th className="py-3 px-4">Verdict</th>}
              <th className="py-3 px-4 pr-10 sm:pr-12 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={adminFilter === 'completed' ? 5 : 4}
                  className="py-8 text-center text-slate-400 italic"
                >
                  No {filterLabel.toLowerCase()} tasks found
                </td>
              </tr>
            ) : (
              rows.map((item) => {
                const queue = getQueue(item.queueId)

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {queue ? queue.job : item.jobName || '—'}
                      </div>
                      {item.description && (
                        <div
                          className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5"
                          title={item.description}
                        >
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {queue ? queue.role : item.roleName || 'Reviewer'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.assignedTo || '—'}</td>
                    {adminFilter === 'completed' && (
                      <td className="py-3 px-4">
                        {item.verdict ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              item.verdict === 'Good'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.verdict}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </td>
                    )}
                    <td className="py-3 px-4 pr-10 sm:pr-12 text-right">
                      <button
                        type="button"
                        onClick={() => openAdminTask(item.id)}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
