import { getPage } from '@/app/lib/actions/page/getPage'
import { getTeamMemberByRole } from '@/app/lib/actions/team/getTeamMemberByRole'
import { BoardMembersClient } from './BoardMembersClient'

export const dynamic = 'force-dynamic'

export default async function BoardMembersPage() {
  const [data, page] = await Promise.all([getTeamMemberByRole('BOARD_MEMBER'), getPage('board-members')])
  return <BoardMembersClient data={data} content={page?.content} />
}
