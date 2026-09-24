'use server'

import prisma from '@/prisma/client'
import { getMailchimpMemberCount } from './mailchimp/getMailchimpMemberCount'
import { listCueBoxEvents } from './cuebox/listCueBoxEvents'
import { listCueBoxEventInstances } from './cuebox/listCueBoxEventInstances'
import { seasonRange } from '@/app/utils/concerts.utils'

export async function getDashboardData() {
  const [
    concerts,
    instancesResult,
    photosCount,
    pendingInquiriesCount,
    campApplicationsCount,
    news,
    testimonials,
    events,
    sponsorsActiveCount,
    mailchimpMemberCount,
    potentialSpamCount,
    newApplicationsCount
  ] = await Promise.all([
    listCueBoxEvents().catch(() => ({ success: false as const, data: [] })),
    listCueBoxEventInstances(seasonRange()).catch(() => ({ success: false as const, data: [] })),
    prisma.photoGalleryImage.count().catch(() => 0),
    prisma.question.count({ where: { hasResponded: false } }).catch(() => 0),
    prisma.campApplication.count().catch(() => 0),
    prisma.news.findMany({ select: { isPublished: true } }).catch(() => []),
    prisma.testimonial.findMany({ select: { isPublished: true } }).catch(() => []),
    prisma.event.findMany({ select: { status: true } }).catch(() => []),
    prisma.sponsor.count({ where: { isActive: true } }).catch(() => 0),
    getMailchimpMemberCount(),
    prisma.question.count({ where: { isPotentialSpam: true, isSpam: false } }),
    prisma.campApplication.count({ where: { isNew: true } })
  ])

  return {
    concerts: concerts.data,
    instances: instancesResult.data,
    pendingInquiriesCount,
    potentialSpamCount,
    newApplicationsCount,
    campApplicationsCount,
    mailchimpCount: mailchimpMemberCount.count,
    sponsorsActiveCount,
    photosCount,
    newsCount: news.length,
    newsLiveCount: news.filter((n) => n.isPublished).length,
    eventsCount: events.length,
    eventsLiveCount: events.filter((e) => e.status === 'PUBLISHED').length,
    testimonialsCount: testimonials.length,
    testimonialsLiveCount: testimonials.filter((t) => t.isPublished).length
  }
}
