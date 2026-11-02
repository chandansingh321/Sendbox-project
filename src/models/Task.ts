import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITaskField {
  id: string
  path: string
  label?: string
  current?: string
  proposed?: string
  decision?: '' | 'accept' | 'no_action'
  reason?: string
  note?: string
  expectedDecision?: '' | 'accept' | 'no_action'
  expectedReason?: string
  isCorrect?: boolean
  description?: string
}

export interface ITask extends Document {
  taskId: string
  queueSlug: string
  name: string
  entityId?: string
  description?: string
  status: 'ready' | 'in_progress' | 'completed'
  workStatus: string
  assignedTo: string
  verdict?: 'Good' | 'Poor'
  score?: number
  correctCount?: number
  totalCount?: number
  fields: ITaskField[]
  createdAt: Date
  updatedAt: Date
}

export const TaskFieldSchema = new Schema<ITaskField>(
  {
    id: { type: String, required: true },
    path: { type: String, required: true },
    label: { type: String, default: '' },
    current: { type: String, default: '' },
    proposed: { type: String, default: '' },
    decision: {
      type: String,
      enum: ['', 'accept', 'no_action'],
      default: '',
    },
    reason: { type: String, default: '' },
    note: { type: String, default: '' },
    expectedDecision: {
      type: String,
      enum: ['', 'accept', 'no_action'],
      default: '',
    },
    expectedReason: { type: String, default: '' },
    isCorrect: { type: Boolean, default: false },
    description: { type: String, default: '' },
  },
  { _id: false }
)

export const TaskSchema = new Schema<ITask>(
  {
    taskId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    queueSlug: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    entityId: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['ready', 'in_progress', 'completed'],
      default: 'ready',
      index: true,
    },
    workStatus: {
      type: String,
      default: 'Waiting',
    },
    assignedTo: {
      type: String,
      default: '',
      index: true,
    },
    verdict: {
      type: String,
      enum: ['Good', 'Poor'],
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    correctCount: {
      type: Number,
      min: 0,
    },
    totalCount: {
      type: Number,
      min: 0,
    },
    fields: {
      type: [TaskFieldSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'tasks',
  }
)

export const Task: Model<ITask> =
  (mongoose.models.Task as Model<ITask>) ||
  mongoose.model<ITask>('Task', TaskSchema)

export default Task
