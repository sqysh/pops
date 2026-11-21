import TeamMemberClient from '@/app/(public)/_components/TeamMemberClient'
import { getPage } from '@/app/lib/actions/page/getPage'
import prisma from '@/prisma/client'
import { notFound } from 'next/navigation'

export default async function StaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [member, allMembers, page] = await Promise.all([
    prisma.teamMember.findUnique({ where: { id } }).catch(() => null),
    prisma.teamMember.findMany({ orderBy: { displayOrder: 'asc' }, where: { role: 'MUSICIAN' } }).catch(() => []),
    getPage('musicians')
  ])

  if (!member) notFound()

  const currentIndex = allMembers.findIndex((m) => m.id === member.id)

  return (
    <TeamMemberClient
      member={member}
      allMembers={allMembers}
      currentIndex={currentIndex}
      role="musicians"
      content={page?.content}
    />
  )
}
