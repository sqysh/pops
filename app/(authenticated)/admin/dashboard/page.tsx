import { getDashboardData } from '@/app/lib/actions/getDashboardData'
import { AdminDashboardClient } from './AdminDashboardClient'
import { requireStaffPage } from '@/app/lib/auth/guards'

export default async function DashboardPage() {
  await requireStaffPage()

  const data = await getDashboardData()

  return <AdminDashboardClient {...data} />
}
