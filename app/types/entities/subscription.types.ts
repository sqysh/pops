export type SubscriptionType = 'SUBSCRIPTION' | 'FLEX'
export type SubscriptionStatus = 'NOT_ON_SALE' | 'ON_SALE'

export interface IPricingTier {
  label: string
  price: string
}

export interface ISubscription {
  id: string
  name: string
  type: SubscriptionType
  status: SubscriptionStatus
  isVisible: boolean
  publicUrl: string
  cueboxEditUrl: string
  tagline: string | null
  description: string | null
  pricingTiers: IPricingTier[]
  createdAt: string
  updatedAt: string
}

// Shape used when creating/editing — no server-managed fields
export interface ISubscriptionInput {
  name: string
  type: SubscriptionType
  status: SubscriptionStatus
  isVisible: boolean
  publicUrl: string
  cueboxEditUrl: string
  tagline: string
  description: string
  pricingTiers: IPricingTier[]
}
