import { getDashboardData } from '@/app/lib/actions/getDashboardData'
import { AdminDashboardClient } from './AdminDashboardClient'

export default async function DashboardPage() {
  const data = await getDashboardData()

  return <AdminDashboardClient {...data} />
}
