import { redirect } from 'next/navigation'
import { auth } from '@/app/lib/auth'
import { getSuperDashboardData } from '@/app/lib/actions/super/getSuperDashboardData'
import SuperClient from '@/app/(authenticated)/v2/super/SuperClient'

export default async function SuperPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  if (session.user.role !== 'SUPER_USER') redirect('/v2/dashboard')

  const data = await getSuperDashboardData()

  return <SuperClient customRequests={data.customRequests} dbHealth={data.dbHealth} />
}
