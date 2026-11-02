import React from 'react'
import { useReview } from '../../context/ReviewContext'
import { ExternalLink, Database, X, CheckCircle2 } from 'lucide-react'

export const DbGuideModal: React.FC = () => {
  const { setModal, syncFromDatabase, showToast, dbStatus } = useReview()

  const handleRetry = () => {
    setModal(null)
    showToast('Checking MongoDB Atlas connection...')
    syncFromDatabase()
  }

  const isConnected = dbStatus === 'connected'

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">MongoDB Atlas Database</h3>
          </div>
          <button
            onClick={() => setModal(null)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 text-xs text-slate-600 space-y-2">
          {isConnected ? (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>MongoDB Atlas is connected and active! Database: <strong>rapid_review</strong>.</span>
            </div>
          ) : (
            <p>
              Your MongoDB Atlas cluster connection string is configured in <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">.env.local</code>.
            </p>
          )}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-4 text-xs text-slate-800">
          <strong className="block font-semibold text-slate-900 mb-1.5">
            Active Database Configuration:
          </strong>
          <ul className="space-y-1 text-slate-600">
            <li>• <strong>Service:</strong> MongoDB Atlas Cloud</li>
            <li>• <strong>Database:</strong> <code className="font-mono text-blue-600">rapid_review</code></li>
            <li>• <strong>Collections:</strong> <code className="font-mono">queues</code>, <code className="font-mono">tasks</code></li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setModal(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleRetry}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Refresh Connection
          </button>
        </div>
      </div>
    </div>
  )
}
