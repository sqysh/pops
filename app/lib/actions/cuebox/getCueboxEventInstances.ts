import { CueBoxEventInstance } from '@/app/types/cuebox.types'
import { cueboxFetch } from '../../utils/cuebox.utils'

export async function getCueBoxEventInstances(eventId: string) {
  if (!eventId) return { success: false, error: 'Event ID is required' }

  const data = await cueboxFetch<{ event_instances: CueBoxEventInstance[] }>(`/events/${eventId}/instances`)

  if (!data) return { success: false, error: 'Failed to fetch event instances' }

  return { success: true, data: data.event_instances }
}
