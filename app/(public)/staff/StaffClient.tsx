'use client'

import TeamMemberGrid from '@/app/(public)/_components/TeamMemberGrid'

export const StaffClient = ({ staff, content }: { staff: any; content?: unknown }) => {
  const sortedStaff = [...staff].sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <div id="main-content">
      <TeamMemberGrid content={content} teamMembers={sortedStaff} headingId="staff-heading" role="staff" />
    </div>
  )
}
