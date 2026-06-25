import { ISubscription, ISubscriptionInput } from '@/app/types/entities/subscription.types'

export function serialize(s: {
  id: string
  name: string
  type: string
  status: string
  isVisible: boolean
  publicUrl: string
  cueboxEditUrl: string
  createdAt: Date
  updatedAt: Date
}): ISubscription {
  return {
    id: s.id,
    name: s.name,
    type: s.type as ISubscription['type'],
    status: s.status as ISubscription['status'],
    isVisible: s.isVisible,
    publicUrl: s.publicUrl,
    cueboxEditUrl: s.cueboxEditUrl,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString()
  }
}

export function validate(input: ISubscriptionInput): string | null {
  if (!input.name?.trim()) return 'Name is required'
  if (!input.publicUrl?.trim()) return 'Public URL is required'
  if (!input.cueboxEditUrl?.trim()) return 'CueBox edit URL is required'
  if (!['SUBSCRIPTION', 'FLEX'].includes(input.type)) return 'Invalid type'
  if (!['ON_SALE', 'NOT_ON_SALE'].includes(input.status)) return 'Invalid status'
  return null
}
