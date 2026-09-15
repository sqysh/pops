import { getTeamMemberByRole } from '@/app/lib/actions/team/getTeamMemberByRole'
import { MusiciansClient } from './MusiciansClient'

export const dynamic = 'force-dynamic'

export default async function MusiciansPage() {
  const data = await getTeamMemberByRole('MUSICIAN')
  return <MusiciansClient data={data} />
}
