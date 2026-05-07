'use server'

import prisma from '@/prisma/client'
import { getMailchimpMemberCount } from './mailchimp/getMailchimpMemberCount'
import { listCueBoxEvents } from './cuebox/listCueBoxEvents'

export async function getDashboardData() {
  const [
    concerts,
    venues,
    teamMembers,
    photosCount,
    questions,
    users,
    campApplications,
    pages,
    newsCount,
    newsLiveCount,
    news,
    testimonialsCount,
    testimonialsLiveCount,
    customRequests,
    eventsCount,
    eventsLiveCount,
    sponsors,
    sponsorsActiveCount,
    mailchimpMemberCount
  ] = await Promise.all([
    listCueBoxEvents(),
    prisma.venue
      .findMany({
        orderBy: { name: 'asc' }
      })
      .catch(() => []),
    prisma.teamMember
      .findMany({
        orderBy: { displayOrder: 'asc' }
      })
      .catch(() => []),
    prisma.photoGalleryImage.count().catch(() => 0),
    prisma.question
      .findMany({
        orderBy: { createdAt: 'desc' },
        take: 50 // Limit
      })
      .catch(() => []),
    prisma.user
      .findMany({
        orderBy: { firstName: 'asc' }
      })
      .catch(() => []),
    prisma.campApplication
      .findMany({
        include: { Student: true, Parent: true, Address: true },
        orderBy: { createdAt: 'desc' },
        take: 100 // Limit
      })
      .catch(() => []),
    prisma.page
      .findMany({
        orderBy: { createdAt: 'asc' }
      })
      .catch(() => []),
    prisma.news.count().catch(() => 0),
    prisma.news.count({ where: { isPublished: true } }).catch(() => 0),
    prisma.news.findMany().catch(() => []),
    prisma.testimonial.count().catch(() => 0),
    prisma.testimonial.count({ where: { isPublished: true } }).catch(() => 0),
    prisma.customRequest
      .findMany({
        orderBy: { submittedAt: 'desc' },
        take: 50 // Limit
      })
      .catch(() => []),
    prisma.event.count().catch(() => 0),
    prisma.event.count({ where: { status: 'PUBLISHED' } }).catch(() => 0),
    prisma.sponsor.findMany({}).catch(() => []),
    prisma.sponsor.count({ where: { isActive: true } }).catch(() => 0),
    getMailchimpMemberCount()
  ])

  return {
    concerts: concerts.data,
    venues,
    teamMembers,
    photosCount,
    questions,
    users,
    campApplications,
    campApplicationsCount: campApplications.length,
    pages,
    pageContentCount: pages.length,
    newsCount,
    newsLiveCount,
    news,
    testimonialsCount,
    testimonialsLiveCount,
    customRequests,
    eventsCount,
    eventsLiveCount,
    sponsors,
    sponsorsActiveCount,
    mailchimpMemberCount
  }
}
