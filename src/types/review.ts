export type UserRole = 'user' | 'admin'

export interface User {
  id?: string
  email: string
  name?: string
  role: UserRole
  avatar?: string
  isActive?: boolean
  assignedQueues?: string[]
  currentTaskId?: string | null
  createdBy?: string
  created_at?: string
  updated_at?: string
}

export type ViewState = 'login' | 'assignments' | 'task' | 'admin' | 'admin-task'

export type DbStatus = 'checking' | 'connected' | 'pending_schema' | 'local'

export type DecisionChoice = 'accept' | 'no_action' | ''

export interface Queue {
  id: string
  job: string
  role: string
  isActive?: boolean
  created_at?: string
}

export interface TaskField {
  id: string
  path: string
  label?: string
  current: string
  proposed: string
  previous?: any[]
  decision: DecisionChoice
  reason?: string
  note?: string
  description?: string
  required?: boolean
  // Ground truth uploaded by admin
  expectedDecision?: DecisionChoice
  expectedReason?: string
}

export interface Task {
  id: string
  queueId: string
  name: string
  entityId?: string
  description?: string
  status: 'ready' | 'in_progress' | 'completed' | 'blocked'
  workStatus: 'Waiting' | 'Active' | 'Done' | 'Blocked' | string
  assignedTo: string
  fields: TaskField[]
  jobName?: string
  roleName?: string
  verdict?: 'Good' | 'Poor'
  score?: number
  correctCount?: number
  totalCount?: number
  created_at?: string
  updated_at?: string
}

export type ModalState =
  | { type: 'db-guide' }
  | { type: 'done'; taskId: string; verdict?: 'Good' | 'Poor' }
  | null

export const NO_ACTION_REASONS: [string, string][] = [
  ['incorrect_cvt', 'Incorrect CVT'],
  ['incomplete_cvt', 'Incomplete CVT'],
  ['unidentifiable_cvt', 'Unidentifiable CVT'],
  ['no_sources', 'No Sources/Contradicting Sources'],
  ['disagreement', 'Disagreement/Revisit'],
  ['none', 'None of the above'],
]
