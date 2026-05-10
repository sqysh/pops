import { listCueBoxEvents } from '@/app/lib/actions/cuebox/listCueBoxEvents'
import ConcertsTestClient from './ConcertsTestClient'
import { listCueBoxEventInstances } from '@/app/lib/actions/cuebox/listCueBoxEventInstances'

export default async function ConcertsTestPage() {
  const result = await listCueBoxEvents()
  const events = result.data ?? []

  const instancesResult = await listCueBoxEventInstances({
    startsAtFrom: '2026-01-01T00:00:00.000Z',
    startsAtTo: '2027-12-31T00:00:00.000Z'
  }).catch(() => ({ success: false, data: [] }))

  const instances = instancesResult.data ?? []

  return <ConcertsTestClient events={events} instances={instances} />
}
