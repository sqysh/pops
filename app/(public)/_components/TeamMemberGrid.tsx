'use client'

import { useRouter } from 'next/navigation'
import TeamMemberCard from './TeamMemberCard'
import type { TeamMember } from '@prisma/client'
import CompactPageHero from '../../(public)/_components/CompactPageHero'
import { pageCopy } from '@/app/lib/page-content/copy'
import { TEAM_PAGES, type TeamRole } from './TeamMemberPages'

interface Props {
  content?: unknown
  teamMembers: TeamMember[]
  headingId: string
  role: TeamRole
}

export default function TeamMemberGrid({ content, teamMembers, headingId, role }: Props) {
  const router = useRouter()
  const { defs, prefix } = TEAM_PAGES[role]
  const { t } = pageCopy(content, defs)
  const heading = t(`${prefix}_hero_heading`)

  const handleCardClick = (teamMember: TeamMember) => {
    router.push(`/${role}/${teamMember.id}`)
  }

  return (
    <>
      <CompactPageHero
        homeLabel={t(`${prefix}_hero_home_crumb`)}
        breadcrumbLabel={t(`${prefix}_sr_breadcrumb`)}
        breadcrumb={t(`${prefix}_hero_breadcrumb`)}
        eyebrow={t(`${prefix}_hero_eyebrow`)}
        heading={heading}
        description={t(`${prefix}_hero_description`)}
      />
      <section aria-labelledby={headingId} className="px-4 430:px-6 768:px-8 relative">
        <div className="max-w-7xl mx-auto py-12 768:py-16">
          <ul
            role="list"
            aria-label={t(`${prefix}_sr_member_list`, { heading })}
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
