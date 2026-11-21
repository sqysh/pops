'use server'

import { createLog } from '@/app/utils/logHelper'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { denied, requireAdmin } from '@/app/lib/auth/guards'
import { canChangeRole, canEditUserDetails, isRole } from '@/app/lib/auth/permissions'

interface UpdateUserInput {
  firstName?: string
  lastName?: string
  role?: string
}

export async function updateUser(id: string, data: UpdateUserInput) {
  const gate = await requireAdmin()
  if (gate.ok === false) return denied(gate)

  if (!id) return { success: false, error: 'User ID is required' }
  if (data?.role !== undefined && !isRole(data.role)) return { success: false, error: 'That is not a valid role' }

  const target = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } }).catch(() => null)
  if (!target) return { success: false, error: 'User not found' }

  const actorParty = { id: gate.userId, role: gate.role }
  const targetParty = { id: target.id, role: target.role }

  const details = canEditUserDetails(actorParty, targetParty)
  if (details.allowed === false) return { success: false, error: details.reason }

  // the role is only ever changed through the same rules as updateUserRole
  if (data.role !== undefined && isRole(data.role)) {
    const verdict = canChangeRole(actorParty, targetParty, data.role)
    if (verdict.allowed === false) return { success: false, error: verdict.reason }
  }

  const context = await getRequestContext()

  const user = await prisma.user
    .update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role !== undefined && isRole(data.role) ? data.role : undefined
      }
    })
    .catch(() => null)

  if (!user) {
    await createLog('error', await buildLogMessage(`failed to update user "${id}"`, gate.name, context), {
      id,
      data,
      error: 'Prisma update failed',
      request: context
    }).catch(() => null)

    return { success: false, error: 'Failed to update user' }
  }

  await createLog('info', await buildLogMessage(`user "${user.email}" updated`, gate.name, context), {
    userId: user.id,
    email: user.email,
    changes: data,
    previousRole: target.role,
    updatedById: gate.userId,
    request: context
  }).catch(() => null)

  revalidateTag('users', '')

  return { success: true, data: user }
}
