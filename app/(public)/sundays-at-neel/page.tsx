import { Metadata } from 'next'
import { listCueBoxEvents } from '@/app/lib/actions/cuebox/listCueBoxEvents'
import { listCueBoxEventInstances } from '@/app/lib/actions/cuebox/listCueBoxEventInstances'
import { getSubscriptions } from '@/app/lib/actions/subscription'
import { SundaysAtNeelClient } from './SundaysAtNeelClient'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Sundays@Neel | The Pops Orchestra',
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

/** Robyn names these "Sundays@Neel-Two Show Series Subscription" in the admin. */
const SERIES_PREFIX = 'Sundays@Neel'

export default async function SundaysAtNeelPage() {
  const [events, instances, subs] = await Promise.all([
    listCueBoxEvents().catch(() => ({ success: false as const, data: [] })),
    listCueBoxEventInstances(seasonRange()).catch(() => ({ success: false as const, data: [] })),
    getSubscriptions().catch(() => ({ success: false as const, data: [] }))
  ])

  // same rule as the admin states: On Sale and visible
  const subscriptions = (subs.data ?? []).filter(
    (sub) => sub.isVisible && sub.status === 'ON_SALE' && sub.name.startsWith(SERIES_PREFIX)
  )

  return <SundaysAtNeelClient concerts={events.data ?? []} instances={instances.data ?? []} subscriptions={subscriptions} />
}
