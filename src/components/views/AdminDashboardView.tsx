import React from 'react'
import { DbAlertBanner } from '../common/DbAlertBanner'
import { AdminUploadSection } from './AdminUploadSection'
import { AdminStatsFilter } from './AdminStatsFilter'
import { AdminTasksTable } from './AdminTasksTable'

export const AdminDashboardView: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      <DbAlertBanner />
      <AdminUploadSection />
      <AdminStatsFilter />
      <AdminTasksTable />
    </div>
  )
}
