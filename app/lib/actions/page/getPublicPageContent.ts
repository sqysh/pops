'use server'

import prisma from '@/prisma/client'

/** Slugs a client component may read directly. Page content is public copy, but
 *  keep the list explicit so this never becomes a general database reader. */
const CLIENT_READABLE = new Set(['server-error'])

export async function getPublicPageContent(slug: string) {
  if (!CLIENT_READABLE.has(slug)) return null
  const page = await prisma.page.findUnique({ where: { slug }, select: { content: true } }).catch(() => null)
  return page?.content ?? null
}
