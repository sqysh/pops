import { listCueBoxEvents } from '@/app/lib/actions/cuebox/listCueBoxEvents'
import ConcertsClient from './ConcertsClient'
import { listCueBoxEventInstances } from '@/app/lib/actions/cuebox/listCueBoxEventInstances'
import prisma from '@/prisma/client'

export const dynamic = 'force-dynamic'

export default async function ConcertsPage() {
  const [concertsPageLive, eventsResult, instancesResult] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: 'concertsPageLive' } }).catch(() => null),
    listCueBoxEvents(),
    listCueBoxEventInstances({
      startsAtFrom: '2026-01-01T00:00:00.000Z',
      startsAtTo: '2027-12-31T00:00:00.000Z'
    }).catch(() => ({ success: false as const, data: [] }))
  ])

  const events = eventsResult.data ?? []
  const instances = instancesResult.data ?? []

  return <ConcertsClient instances={instances} events={events} concertsPageLive={concertsPageLive.value} />
}
