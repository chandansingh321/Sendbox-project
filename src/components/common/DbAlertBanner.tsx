import React from 'react'
import { useReview } from '../../context/ReviewContext'
import { AlertCircle } from 'lucide-react'

export const DbAlertBanner: React.FC = () => {
  const { dbStatus, setModal } = useReview()

  if (dbStatus !== 'pending_schema') return null

  return (
    <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs leading-relaxed">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <strong className="font-semibold text-amber-950">Database tables needed:</strong> Your Supabase project is reachable, but the <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">queues</code> and <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">tasks</code> tables need to be created. Currently using local memory mode. Run <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">schema.sql</code> in your Supabase SQL Editor to enable cloud storage.
        </div>
      </div>
      <button
        type="button"
        onClick={() => setModal({ type: 'db-guide' })}
        className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-white border border-amber-300 font-semibold text-amber-900 hover:bg-amber-100/60 shadow-xs cursor-pointer whitespace-nowrap"
      >
        View SQL Guide
      </button>
    </div>
  )
}
