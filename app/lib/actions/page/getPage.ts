import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'

export async function getPage(slug: string) {
  const page = await prisma.page.findUnique({ where: { slug } }).catch(() => null)
  if (!page) {
    await createLog('error', `Failed to fetch page`, { error: 'Not found', slug }).catch(() => null)
    return null
  }
  return page
}
