'use server'

import prisma from '@/prisma/client'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { createLog } from '@/app/utils/logHelper'
import { revalidateTag } from 'next/cache'
import { denied, requireSuper } from '@/app/lib/auth/guards'
import { canDeleteUser } from '@/app/lib/auth/permissions'

export async function deleteUser(id: string) {
  const gate = await requireSuper()
  if (gate.ok === false) return denied(gate)

  if (!id) return { success: false, error: 'User ID is required' }

  const [target, superUserCount] = await Promise.all([
    prisma.user.findUnique({ where: { id }, select: { id: true, role: true } }).catch(() => null),
    prisma.user.count({ where: { role: 'SUPER_USER' } }).catch(() => 0)
  ])
  if (!target) return { success: false, error: 'User not found' }

  const verdict = canDeleteUser({ id: gate.userId, role: gate.role }, { id: target.id, role: target.role }, superUserCount)
  if (verdict.allowed === false) return { success: false, error: verdict.reason }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const user = await prisma.user.delete({ where: { id } }).catch(() => null)

  if (!user) return { success: false, error: 'Failed to delete user' }

  await createLog(
    'info',
    await buildLogMessage(`deleted user "${user.firstName} ${user.lastName}" (${user.email})`, actor, context),
    {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      deletedBy: actor,
      request: context
    }
  ).catch(() => null)

  revalidateTag('super-users', '')
  return { success: true }
}
