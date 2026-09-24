import { listCueBoxEventInstances } from '@/app/lib/actions/cuebox/listCueBoxEventInstances'
import { listCueBoxEvents } from '@/app/lib/actions/cuebox/listCueBoxEvents'
import { seasonRange } from '@/app/utils/concerts.utils'
import { AdminConcertsClient } from './AdminConcertsClient'

export default async function AdminConcertsPage() {
  const [concerts, instances] = await Promise.all([
    listCueBoxEvents().catch(() => ({ success: false as const, data: [] })),
    listCueBoxEventInstances(seasonRange()).catch(() => ({ success: false as const, data: [] }))
  ])
  return <AdminConcertsClient concerts={concerts.data} instances={instances.data} />
}
