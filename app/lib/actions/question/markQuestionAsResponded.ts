'use server'

import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { getActor } from '../user/getActor'
import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'
import { revalidateTag } from 'next/cache'

export async function markQuestionAsResponded(id: string) {
  if (!id) return { success: false, error: 'Question ID is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const question = await prisma.question
    .update({
      where: { id },
      data: { hasResponded: true }
    })
    .catch(() => null)

  if (!question) return { success: false, error: 'Failed to update question' }

  await createLog(
    'info',
    await buildLogMessage(`marked inquiry from "${question.name}" as responded`, actor, context),
    {
      questionId: question.id,
      name: question.name,
      email: question.email,
      updatedBy: actor,
      request: context
    }
  ).catch(() => null)

  revalidateTag('dashboard', 'default')

  return { success: true, data: question }
}
