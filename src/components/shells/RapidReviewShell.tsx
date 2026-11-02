import React from 'react'
import { DbBadge } from '../common/DbBadge'
import { AvatarMenu } from '../common/AvatarMenu'
import { useReview } from '../../context/ReviewContext'
import { Menu, MoreVertical } from 'lucide-react'

interface RapidReviewShellProps {
  children: React.ReactNode
}

export const RapidReviewShell: React.FC<RapidReviewShellProps> = ({ children }) => {
  const { setView, showToast } = useReview()

  return (
    <div className="min-h-screen bg-[#f1f3f4] text-[#202124] antialiased flex flex-col">
      {/* Top Header */}
      <header className="bg-white h-14 sm:h-16 flex items-center justify-between px-4 sm:px-8 lg:px-12 border-b border-gray-200 shadow-xs sticky top-0 z-50">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <button
            type="button"
            onClick={() => setView('assignments')}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full text-gray-600 focus:outline-none cursor-pointer flex-shrink-0"
            title="Toggle Menu / Back to Assignments"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div
            onClick={() => setView('assignments')}
            className="flex items-center space-x-2 cursor-pointer select-none min-w-0"
          >
            <span className="font-semibold text-sm sm:text-lg tracking-tight text-gray-900 truncate">
              Rapid Review Training
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          <DbBadge />
          <button
            type="button"
            onClick={() => showToast('Rapid review training options')}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full text-gray-600 focus:outline-none cursor-pointer"
            title="More Options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          <AvatarMenu />
        </div>
      </header>

      <main className="w-full flex-1">{children}</main>
    </div>
  )
}
