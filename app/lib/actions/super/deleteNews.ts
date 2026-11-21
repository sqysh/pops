'use server'

import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { getActor } from '../user/getActor'
import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'
import { revalidateTag } from 'next/cache'
import { denied, requireSuper } from '@/app/lib/auth/guards'

export async function deleteNews(id: string) {
  const gate = await requireSuper()
  if (gate.ok === false) return denied(gate)

  if (!id) return { success: false, error: 'Article ID is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const article = await prisma.news
    .delete({
      where: { id }
    })
    .catch(() => null)

  if (!article) {
    await createLog('error', await buildLogMessage(`failed to delete news article "${id}"`, actor, context), {
      articleId: id,
      updatedBy: actor,
      request: context
    }).catch(() => null)

    return { success: false, error: 'Failed to delete article' }
  }

  await createLog('info', await buildLogMessage(`deleted news article "${article.title}"`, actor, context), {
    articleId: id,
    title: article.title,
    updatedBy: actor,
    request: context
  }).catch(() => null)

  revalidateTag('super-news', '')
  return { success: true }
}
