'use server'

import prisma from '@/prisma/client'
import { getPage } from './page/getPage'
import { getSponsors } from './sponsor/getSponsors'
import { getTestimonials } from './testimonial/getTestimonials'

export async function getHomePageData() {
  const [pageData, sponsorsData, testimonialsData, events, news] = await Promise.all([
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
      .catch(() => [])
  ])

  return {
    pageData: pageData?.content,
    sponsors: sponsorsData?.data,
    testimonials: testimonialsData.data,
    events,
    news
  }
}
