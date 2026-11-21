import { FooterDataParsed } from '@/app/types/footer.types'
import prisma from '@/prisma/client'
import { cache } from 'react'
import { PageField } from '@/app/types/page.types'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent as bubblesBashContent } from '@/app/lib/constants/page-content/bubbles-bash'
import { BUBBLES_BASH_SETTING_KEY, BUBBLES_BASH_SLUG } from '@/app/lib/constants/bubbles-bash.constants'

/** Page-content fields for a slug (empty when the row is missing). Deduped per request. */
export const getPageContentBySlug = cache(async (slug: string): Promise<PageField[]> => {
  const page = await prisma.page.findUnique({ where: { slug } }).catch(() => null)
  return Array.isArray(page?.content) ? (page.content as unknown as PageField[]) : []
})

export async function getLayoutData() {
  const [settings, footerPage] = await Promise.all([
    prisma.siteSetting
      .findMany({
        where: { key: { in: ['campApplicationsEnabled', 'concertsPageLive', 'subscriptionsLive', BUBBLES_BASH_SETTING_KEY] } }
      })
      .catch(() => []),
    prisma.page.findUnique({ where: { slug: 'footer' } }).catch(() => null)
  ])

  const campApplicationsSetting = settings.find((s) => s.key === 'campApplicationsEnabled') ?? null
  const concertsPageLive = settings.find((s) => s.key === 'concertsPageLive') ?? null
  const subscriptionsLive = settings.find((s) => s.key === 'subscriptionsLive') ?? null

  // Only the event name is needed site-wide (nav + footer); null hides every Bubbles Bash entry point.
  const bubblesBashLive = settings.find((s) => s.key === BUBBLES_BASH_SETTING_KEY)?.value
  const bubblesBashTitle = bubblesBashLive
    ? pageCopy(await getPageContentBySlug(BUBBLES_BASH_SLUG), bubblesBashContent).t('bash_title') || null
    : null

  return {
    bubblesBashTitle,
    campApplicationsSetting,
    concertsPageLive,
    subscriptionsLive,
    footerData: footerPage as unknown as FooterDataParsed | null
  }
}
