'use server'

import { createLog } from '@/app/utils/logHelper'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

interface UpdateUserInput {
  firstName?: string
  lastName?: string
  role?: string
}

export async function updateUser(id: string, data: UpdateUserInput) {
  const context = await getRequestContext()

  const user = await prisma.user
    .update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role as any
      }
    })
    .catch(() => null)

  if (!user) {
    await createLog('error', await buildLogMessage(`failed to update user "${id}"`, 'admin', context), {
      id,
      data,
      error: 'Prisma update failed',
      request: context
    }).catch(() => null)

    return { success: false, error: 'Failed to update user' }
  }

  await createLog('info', await buildLogMessage(`user "${user.email}" updated`, 'admin', context), {
    userId: user.id,
    email: user.email,
    changes: data,
    request: context
  }).catch(() => null)

  revalidateTag('users', '')

  return { success: true, data: user }
}
