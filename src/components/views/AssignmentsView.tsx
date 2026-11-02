import React from 'react'
import { DbAlertBanner } from '../common/DbAlertBanner'
import { AssignedTasksTable } from './AssignedTasksTable'
import { AssignedQueuesTable } from './AssignedQueuesTable'

export const AssignmentsView: React.FC = () => {
  return (
    <div className="w-full space-y-8 sm:space-y-10">
      <DbAlertBanner />
      <AssignedTasksTable />
      <AssignedQueuesTable />
    </div>
  )
}
