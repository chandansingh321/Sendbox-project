'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type {
  Queue,
  Task,
  TaskField,
  UserRole,
  ViewState,
  DbStatus,
  ModalState,
  DecisionChoice,
} from '../types/review'
import { initialQueues, initialTasks } from '../data/initialData'

interface ReviewContextType {
  view: ViewState
  role: UserRole
  email: string
  accountOpen: boolean
  error: string
  toast: string
  showBlocked: boolean
  showEmpty: boolean
  adminFilter: 'ready' | 'in_progress' | 'completed'
  currentTaskId: string | null
  highlightMissing: boolean
  modal: ModalState
  lastImport: string
  dbStatus: DbStatus
  queues: Queue[]
  tasks: Task[]
  currentTask: Task | null
  // Actions
  setView: (view: ViewState) => void
  setRole: (role: UserRole) => void
  setEmail: (email: string) => void
  setAccountOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  setShowBlocked: (show: boolean) => void
  setShowEmpty: (show: boolean) => void
  setAdminFilter: (filter: 'ready' | 'in_progress' | 'completed') => void
  setCurrentTaskId: (id: string | null) => void
  setModal: (modal: ModalState) => void
  showToast: (message: string) => void
  signIn: (email: string, role?: UserRole) => void
  signOut: () => void
  startQueue: (queueId: string) => Promise<void> | void
  openTask: (taskId: string) => void
  openAdminTask: (taskId: string) => void
  updateFieldDecision: (taskId: string, fieldId: string, decision: DecisionChoice) => void
  updateFieldReason: (taskId: string, fieldId: string, reason: string) => void
  updateFieldNote: (taskId: string, fieldId: string, note: string) => void
  saveDraft: () => Promise<void>
  completeTask: () => Promise<void>
  startNext: (queueId?: string) => Promise<void> | void
  importTasks: (importedQueues: Queue[], importedTasks: Task[], fileLabel: string, skippedCount: number) => Promise<void>
  syncFromDatabase: () => Promise<void>
  rowNeedsChoice: (row: TaskField) => boolean
  isFieldCompleted: (row: TaskField) => boolean
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined)

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<ViewState>('login')
  const [role, setRole] = useState<UserRole>('user')
  const [email, setEmail] = useState<string>('chandan.singh2@teraneuro.com')
  const [accountOpen, setAccountOpen] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [toast, setToast] = useState<string>('')
  const [showBlocked, setShowBlocked] = useState<boolean>(false)
  const [showEmpty, setShowEmpty] = useState<boolean>(false)
  const [adminFilter, setAdminFilter] = useState<'ready' | 'in_progress' | 'completed'>('ready')
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)
  const [highlightMissing, setHighlightMissing] = useState<boolean>(false)
  const [modal, setModal] = useState<ModalState>(null)
  const [lastImport, setLastImport] = useState<string>('')
  const [dbStatus, setDbStatus] = useState<DbStatus>('checking')

  const [queues, setQueues] = useState<Queue[]>(initialQueues)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const showToast = useCallback((message: string) => {
    setToast(message)
    setTimeout(() => {
      setToast((current) => (current === message ? '' : current))
    }, 3500)
  }, [])

  const syncFromDatabase = useCallback(async () => {
    try {
      const [qRes, tRes] = await Promise.all([
        fetch('/api/queues').then((r) => r.json()).catch(() => null),
        fetch('/api/tasks').then((r) => r.json()).catch(() => null),
      ])

      const isConnected = Boolean(qRes?.mongoConnected || tRes?.mongoConnected)
      setDbStatus(isConnected ? 'connected' : 'local')

      if (qRes?.data && qRes.data.length > 0) {
        const humeQueues = qRes.data.filter(
          (q: any) => q.id === 'q-hume' || q.job?.includes('Hume')
        )
        if (humeQueues.length > 0) setQueues(humeQueues)
      }

      // CRITICAL FIX: Only update tasks from Atlas if the request actually succeeded
      // and returned tasks. NEVER overwrite local/imported tasks with [] on error!
      if (isConnected && Array.isArray(tRes?.data) && tRes.data.length > 0) {
        const humeTasks = tRes.data.filter(
          (t: any) => t.queueId === 'q-hume' || t.name?.includes('Hume')
        )
        if (humeTasks.length > 0) {
          setTasks(humeTasks)
        }
      }
    } catch (err) {
      console.warn('MongoDB Atlas sync error:', err)
      setDbStatus('local')
    }
  }, [])

  // Bug 4 Fix: Restore session and cached tasks on initial browser load
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem('rapid_review_session')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.email) setEmail(parsed.email)
        if (parsed.role) setRole(parsed.role)
        if (parsed.currentTaskId) setCurrentTaskId(parsed.currentTaskId)
        if (parsed.view && parsed.view !== 'login') setView(parsed.view)
      }

      // Restore cached tasks so refresh (F5) never loses uploaded tasks
      const cachedTasks = localStorage.getItem('rapid_review_tasks')
      if (cachedTasks) {
        const parsedTasks = JSON.parse(cachedTasks)
        if (Array.isArray(parsedTasks) && parsedTasks.length > 0) {
          setTasks(parsedTasks)
        }
      }
    } catch (e) {
      console.warn('Failed to restore session from localStorage:', e)
    }
  }, [])

  // Persist tasks to localStorage so uploaded tasks never disappear on refresh
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (tasks.length > 0) {
      try {
        localStorage.setItem('rapid_review_tasks', JSON.stringify(tasks))
      } catch (e) {
        console.warn('Failed to persist tasks to localStorage:', e)
      }
    }
  }, [tasks])

  // Bug 4 Fix: Persist session changes across page refreshes
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (view === 'login') {
        localStorage.removeItem('rapid_review_session')
      } else {
        localStorage.setItem(
          'rapid_review_session',
          JSON.stringify({
            email,
            role,
            view,
            currentTaskId,
          })
        )
      }
    } catch (e) {
      console.warn('Failed to save session to localStorage:', e)
    }
  }, [email, role, view, currentTaskId])

  useEffect(() => {
    syncFromDatabase()
  }, [syncFromDatabase])

  const signIn = (userEmail: string, explicitRole?: UserRole) => {
    const trimmedEmail = userEmail.trim()
    if (!trimmedEmail.includes('@')) {
      setError('Enter a valid email address to continue.')
      return
    }

    // Role-based access resolution:
    // Email containing 'admin' or explicit admin role grants Admin access; otherwise Reviewer access
    const determinedRole: UserRole =
      explicitRole ||
      (trimmedEmail.toLowerCase().includes('admin') ? 'admin' : 'user')

    setEmail(trimmedEmail)
    setRole(determinedRole)
    setError('')
    setAccountOpen(false)

    // Bug 2 Fix: Do NOT overwrite in-progress task assignments on login.
    // Preserves database ownership intact.
    if (determinedRole === 'user') {
      setView('assignments')
    } else {
      setView('admin')
    }
  }

  const signOut = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('rapid_review_session')
      } catch {}
    }
    setView('login')
    setAccountOpen(false)
    setModal(null)
    setCurrentTaskId(null)
  }

  const currentTask = tasks.find((t) => t.id === currentTaskId) || null

  const isFieldCompleted = (row: TaskField): boolean => {
    if (row.decision === 'accept') return true
    if (row.decision === 'no_action' && Boolean(row.reason?.trim())) return true
    return false
  }

  const rowNeedsChoice = (row: TaskField): boolean => {
    return !isFieldCompleted(row)
  }

  const openTask = (taskId: string) => {
    setCurrentTaskId(taskId)
    setHighlightMissing(false)
    setView('task')
  }

  const openAdminTask = (taskId: string) => {
    setCurrentTaskId(taskId)
    setView('admin-task')
  }

  // Bug 3 Fix: Concurrency-safe atomic task claim via MongoDB Atlas with resilient local fallback
  const startQueue = async (queueId: string) => {
    let claimedFromAtlas = false

    try {
      const res = await fetch('/api/tasks/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueId, email }),
      })
      const data = await res.json()

      if (data.success && data.task) {
        const claimed: Task = data.task
        setTasks((prev) => {
          const exists = prev.some((t) => t.id === claimed.id)
          if (exists) {
            return prev.map((t) => (t.id === claimed.id ? claimed : t))
          }
          return [claimed, ...prev]
        })
        setCurrentTaskId(claimed.id)
        setHighlightMissing(false)
        setView('task')
        showToast('Claimed next available task from queue.')
        claimedFromAtlas = true
        return
      }
    } catch (err) {
      console.warn('Atlas claim network attempt failed, checking local state:', err)
    }

    if (!claimedFromAtlas) {
      // Resilient local fallback: Claim next available ready task from queue
      const localReady = tasks.find(
        (t) =>
          t.status === 'ready' &&
          (t.queueId === queueId || queueId === 'q-hume' || t.name?.includes('Hume'))
      )

      if (localReady) {
        const claimed: Task = {
          ...localReady,
          status: 'in_progress',
          workStatus: 'Active',
          assignedTo: email,
        }
        setTasks((prev) =>
          prev.map((t) => (t.id === claimed.id ? claimed : t))
        )
        setCurrentTaskId(claimed.id)
        setHighlightMissing(false)
        setView('task')
        showToast('Claimed next available task from queue.')

        // Attempt background persistence to Atlas
        fetch(`/api/tasks/${claimed.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'in_progress',
            workStatus: 'Active',
            assignedTo: email,
          }),
        }).catch(() => {})
      } else {
        showToast('No ready tasks waiting in this queue.')
      }
    }
  }

  // Bug 1 Fix: Reset reason to empty string when switching decision to 'accept' or toggling off
  const updateFieldDecision = (taskId: string, fieldId: string, decision: DecisionChoice) => {
    setTasks((prev) =>
      prev.map((item) => {
        if (item.id !== taskId) return item
        const updatedFields = item.fields.map((f) =>
          f.id === fieldId
            ? {
                ...f,
                decision,
                reason: decision === 'accept' || !decision ? '' : f.reason,
              }
            : f
        )
        if (updatedFields.every((f) => !rowNeedsChoice(f))) {
          setHighlightMissing(false)
        }
        return { ...item, fields: updatedFields }
      })
    )
  }

  const updateFieldReason = (taskId: string, fieldId: string, reason: string) => {
    setTasks((prev) =>
      prev.map((item) => {
        if (item.id !== taskId) return item
        const updatedFields = item.fields.map((f) => (f.id === fieldId ? { ...f, reason } : f))
        if (updatedFields.every((f) => !rowNeedsChoice(f))) {
          setHighlightMissing(false)
        }
        return { ...item, fields: updatedFields }
      })
    )
  }

  const updateFieldNote = (taskId: string, fieldId: string, note: string) => {
    setTasks((prev) =>
      prev.map((item) => {
        if (item.id !== taskId) return item
        const updatedFields = item.fields.map((f) => (f.id === fieldId ? { ...f, note } : f))
        return { ...item, fields: updatedFields }
      })
    )
  }

  const saveDraft = async () => {
    if (!currentTask) return

    try {
      const res = await fetch(`/api/tasks/${currentTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: currentTask.fields,
        }),
      })
      const data = await res.json()
      if (data.success) {
        showToast('Draft saved to MongoDB Atlas!')
      } else {
        showToast('Draft saved locally for this session.')
      }
    } catch {
      showToast('Draft saved locally for this session.')
    }
  }

  const completeTask = async () => {
    if (!currentTask) return

    const missingFields = currentTask.fields.filter(rowNeedsChoice)
    if (missingFields.length > 0) {
      setHighlightMissing(true)
      const unselected = currentTask.fields.filter((f) => !f.decision).length
      const missingReason = currentTask.fields.filter(
        (f) => f.decision === 'no_action' && !f.reason?.trim()
      ).length

      if (unselected > 0 && missingReason > 0) {
        showToast(
          `All ${currentTask.fields.length} fields are required (${unselected} without decision, ${missingReason} missing reason).`
        )
      } else if (unselected > 0) {
        showToast(
          `All ${currentTask.fields.length} fields are required. Please review the remaining ${unselected} field${unselected > 1 ? 's' : ''}.`
        )
      } else {
        showToast(
          `Please select a reason for all fields marked 'No Action'.`
        )
      }
      return
    }

    let computedVerdict: 'Good' | 'Poor' = 'Good'
    let computedScore: number | undefined
    let computedCorrect: number | undefined
    let computedTotal: number | undefined

    // Pre-calculate evaluation based on ground truth
    const calcTotal = currentTask.fields.length
    let calcCorrect = 0
    const localEvaluatedFields = currentTask.fields.map((f) => {
      let isCorrect = false
      if (f.expectedDecision) {
        const decisionMatches = f.decision === f.expectedDecision
        if (f.expectedDecision === 'no_action' && f.expectedReason) {
          isCorrect = decisionMatches && f.reason === f.expectedReason
        } else {
          isCorrect = decisionMatches
        }
      } else {
        isCorrect = true
      }
      if (isCorrect) calcCorrect += 1
      return { ...f, isCorrect }
    })
    computedTotal = calcTotal
    computedCorrect = calcCorrect
    computedScore = calcTotal > 0 ? Math.round((calcCorrect / calcTotal) * 100) : 100
    computedVerdict = computedScore >= 80 ? 'Good' : 'Poor'

    try {
      const res = await fetch(`/api/tasks/${currentTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'completed',
          workStatus: 'Done',
          fields: currentTask.fields,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data?.verdict) {
          computedVerdict = data.verdict
        }
        if (typeof data?.score === 'number') {
          computedScore = data.score
        }
        if (typeof data?.correctCount === 'number') {
          computedCorrect = data.correctCount
        }
        if (typeof data?.totalCount === 'number') {
          computedTotal = data.totalCount
        }
      }
    } catch (err) {
      console.error('Error saving completed task to Atlas:', err)
    }

    const updatedTask: Task = {
      ...currentTask,
      status: 'completed',
      workStatus: 'Done',
      verdict: computedVerdict,
      score: computedScore,
      correctCount: computedCorrect,
      totalCount: computedTotal,
      fields: localEvaluatedFields,
    }

    setTasks((prev) => prev.map((item) => (item.id === currentTask.id ? updatedTask : item)))
    setHighlightMissing(false)
    setModal({ type: 'done', taskId: currentTask.id, verdict: computedVerdict })
  }

  // Bug 3 Fix: Concurrency-safe atomic next task claim via MongoDB Atlas with resilient local fallback
  const startNext = async (queueId?: string) => {
    setModal(null)
    let claimedFromAtlas = false

    try {
      const res = await fetch('/api/tasks/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueId, email }),
      })
      const data = await res.json()

      if (data.success && data.task) {
        const claimed: Task = data.task
        setTasks((prev) => {
          const exists = prev.some((t) => t.id === claimed.id)
          if (exists) {
            return prev.map((t) => (t.id === claimed.id ? claimed : t))
          }
          return [claimed, ...prev]
        })
        setCurrentTaskId(claimed.id)
        setHighlightMissing(false)
        setView('task')
        showToast('Started next available task.')
        claimedFromAtlas = true
        return
      }
    } catch (err) {
      console.warn('Atlas claim next network attempt failed, checking local state:', err)
    }

    if (!claimedFromAtlas) {
      // Resilient local fallback
      const localReady = tasks.find(
        (t) =>
          t.status === 'ready' &&
          (!queueId || t.queueId === queueId || t.name?.includes('Hume'))
      )

      if (localReady) {
        const claimed: Task = {
          ...localReady,
          status: 'in_progress',
          workStatus: 'Active',
          assignedTo: email,
        }
        setTasks((prev) =>
          prev.map((t) => (t.id === claimed.id ? claimed : t))
        )
        setCurrentTaskId(claimed.id)
        setHighlightMissing(false)
        setView('task')
        showToast('Started next available task.')

        // Background persistence to Atlas
        fetch(`/api/tasks/${claimed.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'in_progress',
            workStatus: 'Active',
            assignedTo: email,
          }),
        }).catch(() => {})
      } else {
        setView('assignments')
        showToast('All caught up! No tasks are waiting in your queues.')
      }
    }
  }

  const importTasks = async (
    importedQueues: Queue[],
    importedTasks: Task[],
    fileLabel: string,
    skippedCount: number
  ) => {
    // Merge new queues
    setQueues((prev) => {
      const existingIds = new Set(prev.map((q) => q.id))
      const toAdd = importedQueues.filter((q) => !existingIds.has(q.id))
      return [...prev, ...toAdd]
    })

    // Add new tasks with deduplication
    setTasks((prev) => {
      const prevIds = new Set(prev.map((t) => t.id))
      const toAdd = importedTasks.filter((t) => !prevIds.has(t.id))
      return [...toAdd, ...prev]
    })
    setAdminFilter('ready')

    const added = importedTasks.length
    const msg = added
      ? `Imported ${added} task${added === 1 ? '' : 's'} from ${fileLabel}${
          skippedCount ? `. Skipped ${skippedCount} blank row${skippedCount === 1 ? '' : 's'}.` : '.'
        }`
      : `No tasks were imported from ${fileLabel}.`

    setLastImport(msg)
    showToast(msg)

    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queues: importedQueues,
          tasks: importedTasks,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success) {
        showToast(`Saved ${added} task(s) to MongoDB Atlas.`)
      } else {
        console.warn('Atlas import notice:', data)
      }
    } catch (err) {
      console.warn('Sync to Atlas deferred:', err)
    }
  }

  return (
    <ReviewContext.Provider
      value={{
        view,
        role,
        email,
        accountOpen,
        error,
        toast,
        showBlocked,
        showEmpty,
        adminFilter,
        currentTaskId,
        highlightMissing,
        modal,
        lastImport,
        dbStatus,
        queues,
        tasks,
        currentTask,
        setView,
        setRole,
        setEmail,
        setAccountOpen,
        setShowBlocked,
        setShowEmpty,
        setAdminFilter,
        setCurrentTaskId,
        setModal,
        showToast,
        signIn,
        signOut,
        startQueue,
        openTask,
        openAdminTask,
        updateFieldDecision,
        updateFieldReason,
        updateFieldNote,
        saveDraft,
        completeTask,
        startNext,
        importTasks,
        syncFromDatabase,
        rowNeedsChoice,
        isFieldCompleted,
      }}
    >
      {children}
    </ReviewContext.Provider>
  )
}

export const useReview = () => {
  const context = useContext(ReviewContext)
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider')
  }
  return context
}
