import { CueBoxEventInstance } from '@/app/types/cuebox.types'
import { cueboxFetch } from '../../utils/cuebox.utils'

export async function getCueBoxEventInstance(instanceId: string) {
  if (!instanceId) return { success: false, error: 'Instance ID is required' }

  const data = await cueboxFetch<{ eventInstance: CueBoxEventInstance }>(`/event-instances/${instanceId}`)

  if (!data) return { success: false, error: 'Failed to fetch event instance' }

  return { success: true, data: data.eventInstance }
}
