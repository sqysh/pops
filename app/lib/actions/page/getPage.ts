import { unstable_cache } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'

const getCachedPage = unstable_cache(
  async (slug: string) => {
    return prisma.page.findUnique({ where: { slug } }).catch(() => null)
  },
  ['page'],
  { tags: ['pages'], revalidate: 3600 }
)

export async function getPage(slug: string) {
  const page = await getCachedPage(slug)
  if (!page) {
    await createLog('error', `Failed to fetch page`, { error: 'Not found', slug }).catch(() => null)
    return null
  }
  return page
}
