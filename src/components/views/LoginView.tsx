import React, { useState } from 'react'
import { useReview } from '../../context/ReviewContext'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react'

export const LoginView: React.FC = () => {
  const { signIn, error, showToast } = useReview()
  const [emailInput, setEmailInput] = useState('chandan.singh2@teraneuro.com')
  const [passwordInput, setPasswordInput] = useState('demo123')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Role is automatically resolved based on the account/email
    signIn(emailInput)
  }

  const handleForgotPassword = () => {
    showToast('Password reset link sent to registered email address.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f9] via-[#e8eff8] to-[#dbe7f6] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-9 shadow-xl shadow-slate-300/50 border border-slate-200/90 transition-all">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white font-black text-sm flex items-center justify-center shadow-md ring-4 ring-blue-50 mb-3">
            RR
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Rapid Review Training
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sign in to access your evaluation workspace
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                placeholder="name@company.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500/20 cursor-pointer"
              />
              <span className="text-xs text-slate-600">Remember me</span>
            </label>
          </div>

          {/* Validation error */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-2.5 sm:py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign in</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Role-based Accounts Helper */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Role-based quick fill
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              RBAC Enabled
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setEmailInput('chandan.singh2@teraneuro.com')
                setPasswordInput('demo123')
              }}
              className="py-2 px-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-700 text-[11px] font-medium transition-all text-left flex flex-col cursor-pointer"
            >
              <span className="font-semibold text-slate-900">Reviewer</span>
              <span className="text-[10px] text-slate-400 truncate">chandan.singh2@...</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmailInput('admin@teraneuro.com')
                setPasswordInput('demo123')
              }}
              className="py-2 px-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-700 text-[11px] font-medium transition-all text-left flex flex-col cursor-pointer"
            >
              <span className="font-semibold text-slate-900">Admin</span>
              <span className="text-[10px] text-slate-400 truncate">admin@teraneuro.com</span>
            </button>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-5 text-center">
          <p className="text-[10px] text-slate-400">
            Rapid Review Training • Internal Evaluation System
          </p>
        </div>
      </div>
    </div>
  )
}
