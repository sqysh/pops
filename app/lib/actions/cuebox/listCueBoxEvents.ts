import { CueBoxEvent } from '@/app/types/cuebox.types'
import { cueboxFetch } from '../../utils/cuebox.utils'

export async function listCueBoxEvents(options?: {
  instanceDatetimeStartFrom?: string // ISO date string, defaults to today
  instanceDatetimeStartTo?: string // ISO date string, max 2 years after startFrom
}) {
  const params = new URLSearchParams()

  if (options?.instanceDatetimeStartFrom) params.set('instanceDatetimeStartFrom', options.instanceDatetimeStartFrom)
  if (options?.instanceDatetimeStartTo) params.set('instanceDatetimeStartTo', options.instanceDatetimeStartTo)

  const data = await cueboxFetch<{ events: CueBoxEvent[] }>(`/events`)
  if (!data) return { success: false, error: 'Failed to fetch events' }
  return { success: true, data: data.events }
}
