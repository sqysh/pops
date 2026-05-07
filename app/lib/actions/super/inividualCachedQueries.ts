'use server'

import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'

export const getSuperCustomRequests = unstable_cache(
  () => prisma.customRequest.findMany({ orderBy: { submittedAt: 'desc' } }).catch(() => []),
  ['super-custom-requests'],
  { revalidate: 60, tags: ['super-custom-requests'] }
)

export const getSuperVenues = unstable_cache(
  () => prisma.venue.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }).catch(() => []),
  ['super-venues'],
  { revalidate: 60, tags: ['super-venues'] }
)

export const getSuperTeamMembers = unstable_cache(
  () =>
    prisma.teamMember
      .findMany({
        orderBy: { updatedAt: 'desc' },
        select: { id: true, firstName: true, lastName: true, role: true, updatedAt: true }
      })
      .catch(() => []),
  ['super-team-members'],
  { revalidate: 60, tags: ['super-team-members'] }
)

export const getSuperNews = unstable_cache(
  () =>
    prisma.news
      .findMany({ orderBy: { createdAt: 'desc' }, select: { id: true, title: true, isPublished: true } })
      .catch(() => []),
  ['super-news'],
  { revalidate: 60, tags: ['super-news'] }
)

export const getSuperEvents = unstable_cache(
  () => prisma.event.findMany({ orderBy: { date: 'desc' }, select: { id: true, title: true } }).catch(() => []),
  ['super-events'],
  { revalidate: 60, tags: ['super-events'] }
)

export const getSuperTestimonials = unstable_cache(
  () =>
    prisma.testimonial
      .findMany({
        orderBy: { displayOrder: 'asc' },
        select: { id: true, title: true, isPublished: true, author: true }
      })
      .catch(() => []),
  ['super-testimonials'],
  { revalidate: 60, tags: ['super-testimonials'] }
)

export const getSuperSponsors = unstable_cache(
  () =>
    prisma.sponsor
      .findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true, amount: true, level: true, isActive: true }
      })
      .catch(() => []),
  ['super-sponsors'],
  { revalidate: 60, tags: ['super-sponsors'] }
)

export const getSuperQuestions = unstable_cache(
  () =>
    prisma.question
      .findMany({ orderBy: { createdAt: 'desc' }, select: { id: true, name: true, email: true, hasResponded: true } })
      .catch(() => []),
  ['super-questions'],
  { revalidate: 60, tags: ['super-questions'] }
)

export const getSuperUsers = unstable_cache(
  () =>
    prisma.user
      .findMany({
        orderBy: { email: 'asc' },
        select: { id: true, firstName: true, lastName: true, role: true, email: true }
      })
      .catch(() => []),
  ['super-users'],
  { revalidate: 60, tags: ['super-users'] }
)
