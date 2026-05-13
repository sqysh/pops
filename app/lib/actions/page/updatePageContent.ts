'use server'

import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { revalidateTag } from 'next/cache'

export async function updatePageContent(pageId: string, content) {
  if (!pageId) return { success: false, error: 'Page ID is required' }
  if (!content?.length) return { success: false, error: 'Content is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const page = await prisma.page
    .update({
      where: { id: pageId },
      data: { content }
    })
    .catch(() => null)

  if (!page) return { success: false, error: 'Failed to save page content' }

  await createLog('info', await buildLogMessage(`updated page content for "${page.slug}"`, actor, context), {
    pageId: page.id,
    slug: page.slug,
    fieldCount: Array.isArray(content) ? content.length : null,
    updatedBy: actor,
    request: context
  }).catch(() => null)

  revalidateTag('pages', '')

  return { success: true, data: page }
}
