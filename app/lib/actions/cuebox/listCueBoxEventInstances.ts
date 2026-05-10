import { CueBoxEventInstance } from '@/app/types/cuebox.types'
import { cueboxFetch } from '../../utils/cuebox.utils'

export async function listCueBoxEventInstances(options?: { startsAtFrom?: string; startsAtTo?: string }) {
  const params = new URLSearchParams()
  if (options?.startsAtFrom) params.set('startsAtFrom', options.startsAtFrom)
  if (options?.startsAtTo) params.set('startsAtTo', options.startsAtTo)

  const query = params.toString() ? `?${params.toString()}` : ''
  const data = await cueboxFetch<{ eventInstances: CueBoxEventInstance[] }>(`/event-instances${query}`)

  if (!data) return { success: false, error: 'Failed to fetch event instances' }
  return { success: true, data: data.eventInstances }
}
