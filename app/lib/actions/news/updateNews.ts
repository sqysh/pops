'use server'

import { NewsInput } from '@/app/types/entities/news'
import { getActor } from '../user/getActor'
import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { revalidatePath } from 'next/cache'

export async function updateNews(id: string, data: NewsInput) {
  if (!id) return { success: false, error: 'Article ID is required' }
  if (!data.title) return { success: false, error: 'Title is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const article = await prisma.news
    .update({
      where: { id },
      data: {
        title: data.title,
        excerpt: data.excerpt ?? '',
        body: data.body ?? '',
        imageUrl: data.imageUrl ?? '',
        imageFilename: data.imageFilename ?? '',
        isPublished: data.isPublished ?? false,
        externalLink: data.externalLink ?? ''
      }
    })
    .catch(() => null)

  if (!article) {
    await createLog('error', await buildLogMessage(`failed to update news article "${data.title}"`, actor, context), {
      articleId: id,
      title: data.title,
      updatedBy: actor,
      request: context
    }).catch(() => null)

    return { success: false, error: 'Failed to update article' }
  }

  await createLog('info', await buildLogMessage(`updated news article "${article.title}"`, actor, context), {
    articleId: article.id,
    title: article.title,
    isPublished: article.isPublished,
    updatedBy: actor,
    request: context
  }).catch(() => null)

  revalidatePath('/', 'layout')

  return { success: true, data: article }
}
