'use server'

import prisma from '@/prisma/client'
import { createLog } from '../../../utils/logHelper'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { revalidateTag } from 'next/cache'
import { denied, requireSuper } from '@/app/lib/auth/guards'

export async function deleteQuestion(id: string) {
  const gate = await requireSuper()
  if (gate.ok === false) return denied(gate)

  if (!id) return { success: false, error: 'Question ID is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const question = await prisma.question.delete({ where: { id } }).catch(() => null)

  if (!question) {
    await createLog('error', await buildLogMessage(`failed to delete question "${id}"`, actor, context), {
      questionId: id,
      deletedBy: actor,
      request: context
    }).catch(() => null)

    return { success: false, error: 'Failed to delete question' }
  }

  await createLog('info', await buildLogMessage(`deleted question from "${question.name}" (${question.email})`, actor, context), {
    questionId: question.id,
    name: question.name,
    email: question.email,
    deletedBy: actor,
    request: context
  }).catch(() => null)

  revalidateTag('super-questions', '')
  return { success: true }
}
