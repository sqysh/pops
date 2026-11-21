import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'

/**
 * A page with no row yet is normal: every page falls back to the default
 * wording in its constants file. Only a failed database read is logged.
 */
export async function getPage(slug: string) {
  return prisma.page.findUnique({ where: { slug } }).catch(async (error: unknown) => {
    await createLog('error', `Failed to fetch page`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug
    }).catch(() => null)
    return null
  })
}
