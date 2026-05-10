import prisma from '@/prisma/client'
import TeamClient from './TeamClient'

export default async function TeamPage() {
  const teamMembers = await prisma.teamMember
    .findMany({
      orderBy: { displayOrder: 'asc' }
    })
    .catch(() => [])

  return <TeamClient key={teamMembers.map((m) => m.updatedAt.getTime()).join()} teamMembers={teamMembers} />
}
