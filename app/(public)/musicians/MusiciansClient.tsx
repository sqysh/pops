'use client'

import TeamMemberGrid from '@/app/(public)/_components/TeamMemberGrid'

export const MusiciansClient = ({ data, content }: { data: any; content?: unknown }) => {
  const sortedMusicians = [...data].sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <div id="main-content">
      <TeamMemberGrid content={content} teamMembers={sortedMusicians} headingId="musicians-heading" role="musicians" />
    </div>
  )
}
