import { CueBoxEvent } from '@/app/types/cuebox.types'
import { cueboxFetch } from '../../utils/cuebox.utils'

export async function getCueBoxEvent(eventId: string) {
  if (!eventId) return { success: false, error: 'Event ID is required' }

  const data = await cueboxFetch<{ event: CueBoxEvent }>(`/events/${eventId}`)

  if (!data) return { success: false, error: 'Failed to fetch event' }

  return { success: true, data: data.event }
}
