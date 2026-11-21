import { getPage } from '@/app/lib/actions/page/getPage'
import { getTeamMemberByRole } from '@/app/lib/actions/team/getTeamMemberByRole'
import { StaffClient } from './StaffClient'

export const dynamic = 'force-dynamic'

export default async function StaffPage() {
  const [staff, page] = await Promise.all([getTeamMemberByRole('STAFF'), getPage('staff')])
  return <StaffClient staff={staff} content={page?.content} />
}
