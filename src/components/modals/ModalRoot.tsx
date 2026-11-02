import React from 'react'
import { useReview } from '../../context/ReviewContext'
import { DbGuideModal } from './DbGuideModal'
import { TaskDoneModal } from './TaskDoneModal'

export const ModalRoot: React.FC = () => {
  const { modal } = useReview()

  if (!modal) return null

  if (modal.type === 'db-guide') {
    return <DbGuideModal />
  }

  if (modal.type === 'done') {
    return <TaskDoneModal taskId={modal.taskId} verdict={modal.verdict} />
  }

  return null
}
