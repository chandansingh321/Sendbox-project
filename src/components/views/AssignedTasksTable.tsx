import React from 'react'
import { useReview } from '../../context/ReviewContext'
import { ArrowUpDown } from 'lucide-react'

export const AssignedTasksTable: React.FC = () => {
  const { tasks, queues, email, openTask } = useReview()

  const mine = tasks.filter(
    (item) => item.assignedTo === email && item.status === 'in_progress'
  )

  const getQueue = (queueId: string) => queues.find((q) => q.id === queueId)

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Assigned tasks</span>
          <span
            className="w-4 h-4 rounded-full border border-slate-400 text-slate-500 text-[10px] inline-flex items-center justify-center font-bold"
            title="Tasks already assigned to you"
          >
            i
          </span>
        </h2>
      </div>

      <div className="w-full bg-white rounded-xl border border-slate-300 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-[#e7f0fb] text-slate-700 font-semibold border-b border-slate-200">
              <th className="py-3.5 px-4 sm:px-6">
                <span className="flex items-center gap-1.5">
                  Job <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </span>
              </th>
              <th className="py-3.5 px-4 sm:px-6">
                <span className="flex items-center gap-1.5">
                  Task status <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </span>
              </th>
              <th className="py-3.5 px-4 sm:px-6">
                <span className="flex items-center gap-1.5">
                  Work status <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </span>
              </th>
              <th className="py-3.5 px-4 sm:px-6">
                <span className="flex items-center gap-1.5">
                  Work role <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mine.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 px-6 text-center text-slate-400 italic">
                  No assigned tasks
                </td>
              </tr>
            ) : (
              mine.map((item) => {
                const queue = getQueue(item.queueId)
                const isBlocked = item.status === 'blocked'

                return (
                  <tr
                    key={item.id}
                    onClick={() => !isBlocked && openTask(item.id)}
                    className={`transition-colors ${
                      isBlocked
                        ? 'bg-rose-50/40 text-slate-500'
                        : 'hover:bg-[#f8fbfe] cursor-pointer'
                    }`}
                  >
                    <td className="py-4 px-4 sm:px-6 font-semibold text-slate-900">
                      {queue ? queue.job : item.name}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          item.status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : item.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-800'
                            : item.status === 'blocked'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-slate-700 font-medium">
                      {item.workStatus}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-slate-700">
                      {queue ? queue.role : 'Reviewer'}
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
