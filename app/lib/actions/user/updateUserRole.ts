'use server'

import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'
import type { UserRole } from '@prisma/client'
import { getActor } from './getActor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { denied, requireAdmin } from '@/app/lib/auth/guards'
import { canChangeRole, isRole } from '@/app/lib/auth/permissions'

export async function updateUserRole(userId: string, role: UserRole) {
  const gate = await requireAdmin()
  if (gate.ok === false) return denied(gate)

  if (!userId) return { success: false, error: 'User ID is required' }
  if (!role) return { success: false, error: 'Role is required' }
  if (!isRole(role)) return { success: false, error: 'That is not a valid role' }

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } }).catch(() => null)
  if (!target) return { success: false, error: 'User not found' }

  const verdict = canChangeRole({ id: gate.userId, role: gate.role }, { id: target.id, role: target.role }, role)
  if (verdict.allowed === false) return { success: false, error: verdict.reason }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const user = await prisma.user
    .update({
      where: { id: userId },
      data: { role }
    })
    .catch(() => null)

  if (!user) return { success: false, error: 'Failed to update user role' }

  await createLog(
    'info',
    await buildLogMessage(`updated role for "${user.firstName} ${user.lastName}" to ${role}`, actor, context),
    {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      previousRole: target.role,
      newRole: role,
      updatedBy: actor,
      updatedById: gate.userId,
      request: context
    }
  ).catch(() => null)

  return { success: true, data: user }
}
