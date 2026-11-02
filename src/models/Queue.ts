import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IQueue extends Document {
  slug: string
  job: string
  role: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export const QueueSchema = new Schema<IQueue>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    job: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'Reviewer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'queues',
  }
)

export const Queue: Model<IQueue> =
  (mongoose.models.Queue as Model<IQueue>) ||
  mongoose.model<IQueue>('Queue', QueueSchema)

export default Queue
