import prisma from '@/prisma/client'
import TeamClient from './TeamClient'
import { Suspense } from 'react'

export default async function TeamPage() {
  const teamMembers = await prisma.teamMember
    .findMany({
      orderBy: { displayOrder: 'asc' }
    })
    .catch(() => [])

  return (
    <Suspense fallback={null}>
      <TeamClient key={teamMembers.map((m) => m.updatedAt.getTime()).join()} teamMembers={teamMembers} />
    </Suspense>
  )
}
