import { Metadata } from 'next'
import { listCueBoxEvents } from '@/app/lib/actions/cuebox/listCueBoxEvents'
import { listCueBoxEventInstances } from '@/app/lib/actions/cuebox/listCueBoxEventInstances'
import { SundaysAtNeelClient } from './SundaysAtNeelClient'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Sundays at Neel | The Pops Orchestra',
  description: 'Sunday afternoon performances at Neel Performing Arts Center.'
}

/** CueBox caps the range at two years. Anchor it to now so it doesn't go stale. */
function seasonRange() {
  const now = new Date()
  return {
    startsAtFrom: new Date(Date.UTC(now.getUTCFullYear(), 0, 1)).toISOString(),
    startsAtTo: new Date(Date.UTC(now.getUTCFullYear() + 1, 11, 31)).toISOString()
  }
}

export default async function SundaysAtNeelPage() {
  const [events, instances] = await Promise.all([
    listCueBoxEvents().catch(() => ({ success: false as const, data: [] })),
    listCueBoxEventInstances(seasonRange()).catch(() => ({ success: false as const, data: [] }))
  ])

  return <SundaysAtNeelClient concerts={events.data ?? []} instances={instances.data ?? []} />
}
