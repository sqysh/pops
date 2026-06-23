import { FooterDataParsed } from '@/app/types/common.types'
import prisma from '@/prisma/client'

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
