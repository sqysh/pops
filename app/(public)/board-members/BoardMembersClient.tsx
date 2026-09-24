'use client'

import TeamMemberGrid from '@/app/(public)/_components/TeamMemberGrid'

export const BoardMembersClient = ({ data }) => {
  const sortedBoardMembers = [...data].sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <div id="main-content">
      <TeamMemberGrid
        title="Board Members"
        description="Meet the volunteer leaders who help govern The Pops Orchestra of Bradenton and Sarasota."
        teamMembers={sortedBoardMembers}
        headingId="board-members-heading"
        role="board-members"
      />
    </div>
  )
}
