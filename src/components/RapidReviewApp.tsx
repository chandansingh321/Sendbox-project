'use client'

import React from 'react'
import { useReview } from '../context/ReviewContext'
import { LoginView } from './views/LoginView'
import { TaskyShell } from './shells/TaskyShell'
import { RapidReviewShell } from './shells/RapidReviewShell'
import { AdminShell } from './shells/AdminShell'
import { AssignmentsView } from './views/AssignmentsView'
import { TaskReviewView } from './views/TaskReviewView'
import { AdminDashboardView } from './views/AdminDashboardView'
import { AdminTaskDetailView } from './views/AdminTaskDetailView'
import { ModalRoot } from './modals/ModalRoot'
import { Toast } from './common/Toast'

export const RapidReviewApp: React.FC = () => {
  const { view } = useReview()

  const renderContent = () => {
    switch (view) {
      case 'login':
        return <LoginView />
      case 'assignments':
        return (
          <TaskyShell>
            <AssignmentsView />
          </TaskyShell>
        )
      case 'task':
        return (
          <RapidReviewShell>
            <TaskReviewView />
          </RapidReviewShell>
        )
      case 'admin':
        return (
          <AdminShell>
            <AdminDashboardView />
          </AdminShell>
        )
      case 'admin-task':
        return (
          <AdminShell>
            <AdminTaskDetailView />
          </AdminShell>
        )
      default:
        return <LoginView />
    }
  }

  return (
    <>
      {renderContent()}
      <ModalRoot />
      <Toast />
    </>
  )
}
