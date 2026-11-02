import React from 'react'
import { DbBadge } from '../common/DbBadge'
import { AvatarMenu } from '../common/AvatarMenu'
import { useReview } from '../../context/ReviewContext'
import { LayoutDashboard, CheckSquare } from 'lucide-react'

interface AdminShellProps {
  children: React.ReactNode
}

export const AdminShell: React.FC<AdminShellProps> = ({ children }) => {
  const { view, setView } = useReview()

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-800 flex flex-col">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-14 sm:h-16 px-4 sm:px-8 lg:px-12 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              RR
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
                Rapid Review Training
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden sm:block">
                Admin Workspace
              </p>
            </div>
          </div>

          <nav className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setView('admin')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                view === 'admin'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => setView('admin')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                view === 'admin-task'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Tasks</span>
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <DbBadge />
          <AvatarMenu />
        </div>
      </header>

      <main className="w-full max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 flex-1">
        {children}
      </main>
    </div>
  )
}
