'use server'

import prisma from '@/prisma/client'
import { getMailchimpMemberCount } from './mailchimp/getMailchimpMemberCount'
import { listCueBoxEvents } from './cuebox/listCueBoxEvents'

export async function getDashboardData() {
  const [
    concerts,
    venuesCount,
    teamMembers,
    photosCount,
    questions,
    usersCount,
    campApplications,
    campApplicationsEnabled,
    pagesCount,
    news,
    testimonials,
    events,
    sponsors,
    mailchimpMemberCount
  ] = await Promise.all([
    listCueBoxEvents(),
    prisma.venue.count().catch(() => 0),
    prisma.teamMember.findMany({ orderBy: { displayOrder: 'asc' } }).catch(() => []),
    prisma.photoGalleryImage.count().catch(() => 0),
    prisma.question.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => []),
    prisma.user.count({ where: { role: 'ADMIN' } }).catch(() => 0),
    prisma.campApplication
      .findMany({
        include: { Student: true, Parent: true, Address: true },
        orderBy: { createdAt: 'desc' }
      })
      .catch(() => []),
    prisma.siteSetting.findUnique({ where: { key: 'campApplicationsEnabled' } }).catch(() => null),
    prisma.page.count().catch(() => 0),
    prisma.news.findMany({ select: { isPublished: true } }).catch(() => []),
    prisma.testimonial.findMany({ select: { isPublished: true } }).catch(() => []),
    prisma.event.findMany({ select: { status: true } }).catch(() => []),
    prisma.sponsor.findMany({}).catch(() => []),
    getMailchimpMemberCount()
  ])

  return {
    concerts: concerts.data,
    venuesCount,
    teamMembers,
    photosCount,
    questions,
    usersCount,
    campApplications,
    campApplicationsCount: campApplications.length,
    campApplicationsEnabled: campApplicationsEnabled?.value ?? false,
    pageContentCount: pagesCount,
    newsCount: news.length,
    newsLiveCount: news.filter((n) => n.isPublished).length,
    testimonialsCount: testimonials.length,
    testimonialsLiveCount: testimonials.filter((t) => t.isPublished).length,
    eventsCount: events.length,
    eventsLiveCount: events.filter((e) => e.status === 'PUBLISHED').length,
    sponsorsActiveCount: sponsors.filter((s) => s.isActive).length,
    mailchimpCount: mailchimpMemberCount.count
  }
}
