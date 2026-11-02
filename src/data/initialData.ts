import type { Queue, Task } from '../types/review'

export const initialQueues: Queue[] = [
  {
    id: 'q-hume',
    job: '[Hume] Unreliable Sensitive Assertions Review',
    role: 'Reviewer',
  },
]

// Purely dynamic: tasks are fetched from and stored in MongoDB Atlas, with zero static mock tasks.
export const initialTasks: Task[] = []
