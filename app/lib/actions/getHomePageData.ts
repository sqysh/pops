'use server'

import prisma from '@/prisma/client'
import { BUBBLES_BASH_SETTING_KEY, BUBBLES_BASH_SLUG } from '@/app/lib/constants/bubbles-bash.constants'
import { getPage } from './page/getPage'
import { getSponsors } from './sponsor/getSponsors'
import { getTestimonials } from './testimonial/getTestimonials'

export async function getHomePageData() {
  const [pageData, sponsorsData, testimonialsData, events, news, concertsPageLive, bubblesBashSetting] = await Promise.all([
    getPage('home').catch(() => null),
    getSponsors().catch(() => ({ data: [] })),
    getTestimonials().catch(() => ({ data: [] })),
    prisma.event
      .findMany({
        orderBy: { date: 'desc' },
        take: 10
      })
      .catch(() => []),
    prisma.news
      .findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
      .catch(() => []),
    prisma.siteSetting.findUnique({ where: { key: 'concertsPageLive' } }).catch(() => null),
    prisma.siteSetting.findUnique({ where: { key: BUBBLES_BASH_SETTING_KEY } }).catch(() => null)
  ])

  const bubblesBashContent = bubblesBashSetting?.value
    ? ((await getPage(BUBBLES_BASH_SLUG).catch(() => null))?.content ?? [])
    : null

  return {
    bubblesBashContent,
    pageData: pageData?.content,
    sponsors: sponsorsData?.data,
    testimonials: testimonialsData.data,
    events,
    news,
    concertsPageLive: concertsPageLive.value
  }
}
