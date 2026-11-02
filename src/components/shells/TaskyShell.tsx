import React from 'react'
import { DbBadge } from '../common/DbBadge'
import { AvatarMenu } from '../common/AvatarMenu'
import { useReview } from '../../context/ReviewContext'
import { MoreVertical } from 'lucide-react'

const TABS = ['Assignments', 'Tasks']

interface TaskyShellProps {
  children: React.ReactNode
}

export const TaskyShell: React.FC<TaskyShellProps> = ({ children }) => {
  const { showToast } = useReview()

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <header className="sticky top-0 z-30 bg-[#d9e6f8] border-b border-[#c8d9ef] h-14 sm:h-16 px-4 sm:px-8 lg:px-12 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4 sm:gap-8 min-w-0 flex-1">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              RR
            </div>
            <span className="font-semibold text-base sm:text-lg text-slate-900 truncate">
              Rapid Review Training
            </span>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center space-x-1 overflow-x-auto h-14 sm:h-16 scrollbar-none">
            {TABS.map((tab) => {
              const isActive = tab === 'Assignments'
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => !isActive && showToast(`Section "${tab}" is a placeholder in this demo.`)}
                  className={`h-14 sm:h-16 px-3.5 sm:px-4 text-xs sm:text-sm font-medium transition-colors border-b-[3px] whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-[#1a73c7] text-slate-900 font-semibold'
                      : 'border-transparent text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <DbBadge />
          <button
            type="button"
            onClick={() => showToast('Review interface help')}
            className="w-8 h-8 rounded-full border border-slate-700 text-slate-800 hover:bg-slate-200/60 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
            title="Help"
          >
            ?
          </button>
          <button
            type="button"
            onClick={() => showToast('Additional options menu')}
            className="w-8 h-8 rounded-full text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
            title="More"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          <AvatarMenu />
        </div>
      </header>

      {/* Expansive Main Container */}
      <main className="w-full max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8 flex-1">
        {children}
      </main>
    </div>
  )
}
