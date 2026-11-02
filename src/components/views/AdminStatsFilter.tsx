import React from 'react'
import { useReview } from '../../context/ReviewContext'
import { CheckCircle2, Clock, PlayCircle } from 'lucide-react'

export const AdminStatsFilter: React.FC = () => {
  const { tasks, adminFilter, setAdminFilter } = useReview()

  const counts = {
    ready: tasks.filter((t) => t.status === 'ready').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }

  const items: {
    status: 'ready' | 'in_progress' | 'completed'
    label: string
    icon: React.ReactNode
    count: number
  }[] = [
    {
      status: 'ready',
      label: 'Ready Tasks',
      icon: <PlayCircle className="w-4 h-4 text-emerald-600" />,
      count: counts.ready,
    },
    {
      status: 'in_progress',
      label: 'In Progress Tasks',
      icon: <Clock className="w-4 h-4 text-amber-600" />,
      count: counts.in_progress,
    },
    {
      status: 'completed',
      label: 'Completed Tasks',
      icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
      count: counts.completed,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
      {items.map(({ status, label, icon, count }) => {
        const isSelected = adminFilter === status
        return (
          <button
            key={status}
            type="button"
            onClick={() => setAdminFilter(status)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer bg-white ${
              isSelected
                ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-sm'
                : 'border-slate-200/80 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {label}
              </span>
              {icon}
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{count}</div>
          </button>
        )
      })}
    </div>
  )
}
