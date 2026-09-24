import TeamMemberClient from '@/app/(public)/_components/TeamMemberClient'
import prisma from '@/prisma/client'
import { notFound } from 'next/navigation'

export default async function BoardMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [member, allMembers] = await Promise.all([
    prisma.teamMember.findUnique({ where: { id } }).catch(() => null),
    prisma.teamMember.findMany({ orderBy: { displayOrder: 'asc' }, where: { role: 'BOARD_MEMBER' } }).catch(() => [])
  ])

  if (!member) notFound()

  const currentIndex = allMembers.findIndex((m) => m.id === member.id)

  return <TeamMemberClient member={member} allMembers={allMembers} currentIndex={currentIndex} role="board-members" />
}
