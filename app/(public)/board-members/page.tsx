import { getTeamMemberByRole } from '@/app/lib/actions/team/getTeamMemberByRole'
import { BoardMembersClient } from './BoardMembersClient'

export const dynamic = 'force-dynamic'

export default async function BoardMembersPage() {
  const data = await getTeamMemberByRole('BOARD_MEMBER')
  return <BoardMembersClient data={data} />
}
