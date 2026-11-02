import React from 'react'
import { useReview } from '../../context/ReviewContext'
import { ArrowUpDown, Play } from 'lucide-react'

export const AssignedQueuesTable: React.FC = () => {
  const { queues, tasks, startQueue } = useReview()

  const availableCount = (queueId: string) =>
    tasks.filter((t) => t.queueId === queueId && t.status === 'ready').length

  const visibleQueues = queues

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Assigned queues</span>
          <span
            className="w-4 h-4 rounded-full border border-slate-400 text-slate-500 text-[10px] inline-flex items-center justify-center font-bold"
            title="Queues you can take a task from"
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
                  Role <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </span>
              </th>
              <th className="py-3.5 px-4 sm:px-6">
                <span className="flex items-center gap-1.5">
                  Available tasks <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </span>
              </th>
              <th className="py-3.5 px-4 sm:px-6 text-right sm:pr-12 md:pr-16">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleQueues.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 px-6 text-center text-slate-400 italic">
                  No available queues
                </td>
              </tr>
            ) : (
              visibleQueues.map((queue) => {
                const count = availableCount(queue.id)

                return (
                  <tr key={queue.id} className="hover:bg-[#f8fbfe] transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-semibold text-slate-900 text-xs sm:text-base">
                      {queue.job}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-slate-700 text-xs sm:text-sm">
                      {queue.role}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span className="inline-flex items-center justify-center min-w-[32px] px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200/70">
                        {count}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right sm:pr-12 md:pr-16">
                      <button
                        type="button"
                        onClick={() => startQueue(queue.id)}
                        disabled={count === 0}
                        className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-blue-600 text-blue-700 hover:bg-blue-50 active:bg-blue-100 disabled:opacity-40 disabled:border-slate-300 disabled:text-slate-400 disabled:hover:bg-transparent transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start</span>
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
