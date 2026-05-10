import DashboardClient2 from '@/app/(authenticated)/v2/dashboard/DashboardClient2'
import { getDashboardData } from '@/app/lib/actions/getDashboardData'

export default async function DashboardPage() {
  const data = await getDashboardData()

  return <DashboardClient2 {...data} />
}
