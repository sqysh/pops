'use client'

import { useRouter } from 'next/navigation'
import TeamMemberCard from './TeamMemberCard'
import type { TeamMember } from '@prisma/client'
import CompactPageHero from '../../(public)/_components/CompactPageHero'

interface Props {
  title: string
  description?: string
  teamMembers: TeamMember[]
  headingId: string
  role: string
}

export default function TeamMemberGrid({ title, description, teamMembers, headingId, role }: Props) {
  const router = useRouter()

  const handleCardClick = (teamMember: TeamMember) => {
    router.push(`/${role}/${teamMember.id}`)
  }

  return (
    <>
      <CompactPageHero breadcrumb={title} heading={title} description={description} />
      <section aria-labelledby={headingId} className="px-4 430:px-6 768:px-8 relative">
        <div className="max-w-7xl mx-auto py-12 768:py-16">
          <ul
            role="list"
            aria-label={`${title} members`}
            className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 990:grid-cols-5 gap-4 430:gap-5 768:gap-6"
          >
            {teamMembers.map((teamMember, index) => (
              <li key={teamMember.id}>
                <TeamMemberCard teamMember={teamMember} index={index} onClick={() => handleCardClick(teamMember)} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
