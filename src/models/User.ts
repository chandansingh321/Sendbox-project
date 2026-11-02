import mongoose, { Schema, Document, Model } from 'mongoose'

export type UserRole = 'user' | 'admin'

export interface IUser extends Document {
  email: string
  name?: string
  password?: string
  role: UserRole
  avatar?: string
  isActive: boolean
  assignedQueues?: string[]
  currentTaskId?: string
  createdBy?: string
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      index: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    assignedQueues: {
      type: [String],
      default: [],
    },
    currentTaskId: {
      type: String,
      default: null,
    },
    createdBy: {
      type: String,
      default: 'system',
      trim: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
)

export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema)

export default User
