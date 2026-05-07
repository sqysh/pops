import { listCueBoxEvents } from '@/app/lib/actions/cuebox/listCueBoxEvents'
import ConcertsTestClient from './ConcertsTestClient'

export default async function ConcertsTestPage() {
  const result = await listCueBoxEvents()
  return <ConcertsTestClient events={result.data} />
}
