import prisma from '@/prisma/client'
import { EventsClient } from './EventsClient'
import { requireStaffPage } from '@/app/lib/auth/guards'

export default async function EventsPage() {
  await requireStaffPage()

  const events = await prisma.event
    .findMany({
      orderBy: { date: 'asc' }
    })
    .catch(() => [])

  return <EventsClient events={events} />
}
