import prisma from '@/prisma/client'
import { EventsClient } from './EventsClient'

export default async function EventsPage() {
  const events = await prisma.event
    .findMany({
      orderBy: { date: 'asc' }
    })
    .catch(() => [])

  return <EventsClient events={events} />
}
