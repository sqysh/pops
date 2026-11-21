import { requireSuperPage } from '@/app/lib/auth/guards'
import { getSuperDashboardData } from '@/app/lib/actions/super/getSuperDashboardData'
import SuperClient from '@/app/(authenticated)/admin/super/SuperClient'

export default async function SuperPage() {
  await requireSuperPage()

  const data = await getSuperDashboardData()

  return <SuperClient customRequests={data.customRequests} dbHealth={data.dbHealth} />
}
