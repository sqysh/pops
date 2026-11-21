'use server'

import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'
import { getActor } from '../user/getActor'
import { NewsInput } from '@/app/types/entities/news'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { revalidateTag } from 'next/cache'
import { requireStaff, denied } from '@/app/lib/auth/guards'

export async function createNews(data: NewsInput) {
  const gate = await requireStaff()
  if (gate.ok === false) return denied(gate)

  if (!data.title) return { success: false, error: 'Title is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const article = await prisma.news
    .create({
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
    await createLog('error', await buildLogMessage(`failed to create news article "${data.title}"`, actor, context), {
      title: data.title,
      createdBy: actor,
      request: context
    }).catch(() => null)

    return { success: false, error: 'Failed to create article' }
  }

  await createLog('info', await buildLogMessage(`created news article "${article.title}"`, actor, context), {
    articleId: article.id,
    title: article.title,
    isPublished: article.isPublished,
    createdBy: actor,
    request: context
  }).catch(() => null)

  revalidateTag('dashboard', 'default')

  return { success: true, data: article }
}
