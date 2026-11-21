'use client'

import TeamMemberGrid from '@/app/(public)/_components/TeamMemberGrid'

export const BoardMembersClient = ({ data, content }: { data: any; content?: unknown }) => {
  const sortedBoardMembers = [...data].sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <div id="main-content">
      <TeamMemberGrid content={content} teamMembers={sortedBoardMembers} headingId="board-members-heading" role="board-members" />
    </div>
  )
}
