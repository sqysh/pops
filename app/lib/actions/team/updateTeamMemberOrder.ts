'use server'

import { createLog } from '@/app/utils/logHelper'
import prisma from '@/prisma/client'
import type { TeamMember, TeamMemberRole } from '@prisma/client'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { revalidateTag } from 'next/cache'
import { requireStaff, denied } from '@/app/lib/auth/guards'

const VALID_ROLES: TeamMemberRole[] = ['BOARD_MEMBER', 'STAFF', 'MUSICIAN']

async function updateOrderInDatabase(members: TeamMember[]) {
  return Promise.all(
    members.map((member, index) =>
      prisma.teamMember
        .update({
          where: { id: member.id },
          data: { displayOrder: index + 1 }
        })
        .catch(() => null)
    )
  )
}

export async function updateTeamMembersOrder(teamMembers: TeamMember[]) {
  const gate = await requireStaff()
  if (gate.ok === false) return denied(gate)

  if (!teamMembers?.length) return { success: false, error: 'No team members provided' }
  const isValid = teamMembers.every((m) => m.id && VALID_ROLES.includes(m.role as TeamMemberRole))
  if (!isValid) return { success: false, error: 'Invalid team member data — missing id or role' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const byRole = (role: TeamMemberRole) => teamMembers.filter((m) => (m.role as TeamMemberRole) === role)

  const [savedBoard, savedStaff, savedMusicians] = await Promise.all([
    updateOrderInDatabase(byRole('BOARD_MEMBER')),
    updateOrderInDatabase(byRole('STAFF')),
    updateOrderInDatabase(byRole('MUSICIAN'))
  ])

  await createLog('info', await buildLogMessage('reordered team members', actor, context), {
    boardMembers: savedBoard.length,
    staff: savedStaff.length,
    musicians: savedMusicians.length,
    total: teamMembers.length,
    updatedBy: actor,
    request: context
  }).catch(() => null)

  revalidateTag('dashboard', 'default')

  return {
    success: true,
    data: {
      boardMembers: savedBoard.length,
      staff: savedStaff.length,
      musicians: savedMusicians.length
    }
  }
}
