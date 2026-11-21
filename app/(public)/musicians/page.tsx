import { getPage } from '@/app/lib/actions/page/getPage'
import { getTeamMemberByRole } from '@/app/lib/actions/team/getTeamMemberByRole'
import { MusiciansClient } from './MusiciansClient'

export const dynamic = 'force-dynamic'

export default async function MusiciansPage() {
  const [data, page] = await Promise.all([getTeamMemberByRole('MUSICIAN'), getPage('musicians')])
  return <MusiciansClient data={data} content={page?.content} />
}
