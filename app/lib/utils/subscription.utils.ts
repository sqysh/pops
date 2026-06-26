import { IPricingTier, ISubscription, ISubscriptionInput } from '@/app/types/entities/subscription.types'
import { Subscription } from '@prisma/client'

export function serialize(s: Subscription): ISubscription {
  return {
    id: s.id,
    name: s.name,
    type: s.type,
    status: s.status,
    isVisible: s.isVisible,
    publicUrl: s.publicUrl,
    cueboxEditUrl: s.cueboxEditUrl,
    tagline: s.tagline ?? null,
    description: s.description ?? null,
    pricingTiers: Array.isArray(s.pricingTiers) ? (s.pricingTiers as unknown as IPricingTier[]) : [],
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
