import React from 'react'
import { useReview } from '../../context/ReviewContext'

export const DbBadge: React.FC = () => {
  const { dbStatus, setModal } = useReview()

  if (dbStatus === 'pending_schema') {
    return (
      <button
        type="button"
        onClick={() => setModal({ type: 'db-guide' })}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
        title="Supabase tables not found. Click to view SQL setup guide."
      >
        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        <span>Setup Tables</span>
      </button>
    )
  }

  return null
}
