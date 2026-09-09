'use server'

import prisma from '@/prisma/client'
import { getMailchimpMemberCount } from './mailchimp/getMailchimpMemberCount'
import { listCueBoxEvents } from './cuebox/listCueBoxEvents'
import { listCueBoxEventInstances } from './cuebox/listCueBoxEventInstances'

/** CueBox caps the range at two years. Anchor it to now so it doesn't go stale. */
function seasonRange() {
  const now = new Date()
  const from = new Date(Date.UTC(now.getUTCFullYear(), 0, 1))
  const to = new Date(Date.UTC(now.getUTCFullYear() + 1, 11, 31))
  return { startsAtFrom: from.toISOString(), startsAtTo: to.toISOString() }
}

export async function getDashboardData() {
  const [
    concerts,
    instancesResult,
    venuesCount,
    teamCount,
    photosCount,
    pendingInquiriesCount,
    usersCount,
    campApplicationsCount,
    pagesCount,
    news,
    testimonials,
    events,
    sponsorsActiveCount,
    mailchimpMemberCount
  ] = await Promise.all([
    listCueBoxEvents().catch(() => ({ success: false as const, data: [] })),
    listCueBoxEventInstances(seasonRange()).catch(() => ({ success: false as const, data: [] })),
    prisma.venue.count().catch(() => 0),
    prisma.teamMember.count().catch(() => 0),
    prisma.photoGalleryImage.count().catch(() => 0),
    prisma.question.count({ where: { hasResponded: false } }).catch(() => 0),
    prisma.user.count({ where: { role: 'ADMIN' } }).catch(() => 0),
    prisma.campApplication.count().catch(() => 0),
    prisma.page.count().catch(() => 0),
    prisma.news.findMany({ select: { isPublished: true } }).catch(() => []),
    prisma.testimonial.findMany({ select: { isPublished: true } }).catch(() => []),
    prisma.event.findMany({ select: { status: true } }).catch(() => []),
    prisma.sponsor.count({ where: { isActive: true } }).catch(() => 0),
    getMailchimpMemberCount()
  ])

  return {
    concerts: concerts.data,
    instances: instancesResult.data,
    venuesCount,
    teamCount,
    photosCount,
    pendingInquiriesCount,
    usersCount,
    campApplicationsCount,
    pageContentCount: pagesCount,
    newsCount: news.length,
    newsLiveCount: news.filter((n) => n.isPublished).length,
    testimonialsCount: testimonials.length,
    testimonialsLiveCount: testimonials.filter((t) => t.isPublished).length,
    eventsCount: events.length,
    eventsLiveCount: events.filter((e) => e.status === 'PUBLISHED').length,
    sponsorsActiveCount,
    mailchimpCount: mailchimpMemberCount.count
  }
}
