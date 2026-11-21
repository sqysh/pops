import { FooterDataParsed } from '@/app/types/footer.types'
import prisma from '@/prisma/client'
import { cache } from 'react'
import { PageField } from '@/app/types/page.types'

/** Page-content fields for a slug (empty when the row is missing). Deduped per request. */
export const getPageContentBySlug = cache(async (slug: string): Promise<PageField[]> => {
  const page = await prisma.page.findUnique({ where: { slug } }).catch(() => null)
  return Array.isArray(page?.content) ? (page.content as unknown as PageField[]) : []
})

export async function getLayoutData() {
  const [settings, footerPage] = await Promise.all([
    prisma.siteSetting
      .findMany({
        where: { key: { in: ['campApplicationsEnabled', 'concertsPageLive', 'subscriptionsLive'] } }
      })
      .catch(() => []),
    prisma.page.findUnique({ where: { slug: 'footer' } }).catch(() => null)
  ])

  const campApplicationsSetting = settings.find((s) => s.key === 'campApplicationsEnabled') ?? null
  const concertsPageLive = settings.find((s) => s.key === 'concertsPageLive') ?? null
  const subscriptionsLive = settings.find((s) => s.key === 'subscriptionsLive') ?? null

  return {
    campApplicationsSetting,
    concertsPageLive,
    subscriptionsLive,
    footerData: footerPage as unknown as FooterDataParsed | null
  }
}
