import { listCueBoxEvents } from '@/app/lib/actions/cuebox/listCueBoxEvents'
import ConcertsClient from './ConcertsClient'

export const revalidate = 3600

export default async function ConcertsPage() {
  const now = new Date()
  const twoYearsOut = new Date(now)
  twoYearsOut.setFullYear(twoYearsOut.getFullYear() + 2)

  const result = await listCueBoxEvents({
    instanceDatetimeStartFrom: now.toISOString(),
    instanceDatetimeStartTo: twoYearsOut.toISOString()
  })

  const events = result.success ? (result.data ?? []) : []

  return <ConcertsClient events={events} />
}
