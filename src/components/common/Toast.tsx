import React from 'react'
import { useReview } from '../../context/ReviewContext'

export const Toast: React.FC = () => {
  const { toast } = useReview()

  if (!toast) return null

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-full text-xs font-medium shadow-xl z-50 max-w-lg text-center animate-fade-in border border-slate-800">
      {toast}
    </div>
  )
}
