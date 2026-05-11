'use server'

import { createLog } from '@/app/utils/logHelper'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function markAsSpam(id: string) {
  const context = await getRequestContext()

  const question = await prisma.question
    .update({
      where: { id },
      data: { isSpam: true, hasResponded: true }
    })
    .catch(() => null)

  if (!question) {
    await createLog('error', await buildLogMessage(`failed to mark question "${id}" as spam`, 'admin', context), {
      id,
      error: 'Prisma update failed',
      request: context
    }).catch(() => null)

    return { success: false, error: 'Failed to mark as spam' }
  }

  await createLog('info', await buildLogMessage(`question "${id}" marked as spam`, 'admin', context), {
    id,
    email: question.email,
    request: context
  }).catch(() => null)

  revalidateTag('questions', '')

  return { success: true }
}
