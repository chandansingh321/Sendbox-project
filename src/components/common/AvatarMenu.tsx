import React, { useRef, useEffect } from 'react'
import { useReview } from '../../context/ReviewContext'
import { LogOut } from 'lucide-react'

export const AvatarMenu: React.FC = () => {
  const { email, accountOpen, setAccountOpen, signOut } = useReview()
  const menuRef = useRef<HTMLDivElement>(null)

  const initial = (email || 'U').slice(0, 1).toUpperCase()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setAccountOpen])

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setAccountOpen((prev) => !prev)}
        className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-xs flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
        aria-label="Account menu"
      >
        {initial}
      </button>

      {accountOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
          <div className="px-3.5 py-2 border-b border-slate-100">
            <p className="text-xs text-slate-400 font-medium">Signed in as</p>
            <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">{email}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="w-full px-3.5 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  )
}
