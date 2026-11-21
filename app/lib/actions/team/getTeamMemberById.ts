'use server'

import prisma from '@/prisma/client'
import { requireStaff, denied } from '@/app/lib/auth/guards'

export async function getTeamMemberById(teamMemberId: string) {
  const gate = await requireStaff()
  if (gate.ok === false) return denied(gate)

  if (!teamMemberId) return { success: false, error: 'Team member ID is required' }

  const teamMember = await prisma.teamMember
    .findUnique({
      where: { id: teamMemberId }
    })
    .catch(() => null)

  if (!teamMember) return { success: false, error: 'Team member not found' }

  return { success: true, data: teamMember }
}
