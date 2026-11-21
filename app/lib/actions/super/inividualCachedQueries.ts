'use server'

import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'
import { requireSuper } from '@/app/lib/auth/guards'

const cachedGetSuperCustomRequests = unstable_cache(
  () => prisma.customRequest.findMany({ orderBy: { submittedAt: 'desc' } }).catch(() => []),
  ['super-custom-requests'],
  { revalidate: 60, tags: ['super-custom-requests'] }
)

const cachedGetSuperVenues = unstable_cache(
  () => prisma.venue.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }).catch(() => []),
  ['super-venues'],
  { revalidate: 60, tags: ['super-venues'] }
)

const cachedGetSuperTeamMembers = unstable_cache(
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

const cachedGetSuperNews = unstable_cache(
  () =>
    prisma.news
      .findMany({ orderBy: { createdAt: 'desc' }, select: { id: true, title: true, isPublished: true } })
      .catch(() => []),
  ['super-news'],
  { revalidate: 60, tags: ['super-news'] }
)

const cachedGetSuperEvents = unstable_cache(
  () => prisma.event.findMany({ orderBy: { date: 'desc' }, select: { id: true, title: true } }).catch(() => []),
  ['super-events'],
  { revalidate: 60, tags: ['super-events'] }
)

const cachedGetSuperTestimonials = unstable_cache(
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

const cachedGetSuperSponsors = unstable_cache(
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

const cachedGetSuperQuestions = unstable_cache(
  () =>
    prisma.question
      .findMany({ orderBy: { createdAt: 'desc' }, select: { id: true, name: true, email: true, hasResponded: true } })
      .catch(() => []),
  ['super-questions'],
  { revalidate: 60, tags: ['super-questions'] }
)

const cachedGetSuperUsers = unstable_cache(
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

// Every export of a 'use server' file can be called from the browser, so each one checks for a super user first.
export async function getSuperCustomRequests() {
  const gate = await requireSuper()
  if (gate.ok === false) throw new Error(gate.error)
  return cachedGetSuperCustomRequests()
}

export async function getSuperVenues() {
  const gate = await requireSuper()
  if (gate.ok === false) throw new Error(gate.error)
  return cachedGetSuperVenues()
}

export async function getSuperTeamMembers() {
  const gate = await requireSuper()
  if (gate.ok === false) throw new Error(gate.error)
  return cachedGetSuperTeamMembers()
}

export async function getSuperNews() {
  const gate = await requireSuper()
  if (gate.ok === false) throw new Error(gate.error)
  return cachedGetSuperNews()
}

export async function getSuperEvents() {
  const gate = await requireSuper()
  if (gate.ok === false) throw new Error(gate.error)
  return cachedGetSuperEvents()
}

export async function getSuperTestimonials() {
  const gate = await requireSuper()
  if (gate.ok === false) throw new Error(gate.error)
  return cachedGetSuperTestimonials()
}

export async function getSuperSponsors() {
  const gate = await requireSuper()
  if (gate.ok === false) throw new Error(gate.error)
  return cachedGetSuperSponsors()
}

export async function getSuperQuestions() {
  const gate = await requireSuper()
  if (gate.ok === false) throw new Error(gate.error)
  return cachedGetSuperQuestions()
}

export async function getSuperUsers() {
  const gate = await requireSuper()
  if (gate.ok === false) throw new Error(gate.error)
  return cachedGetSuperUsers()
}
