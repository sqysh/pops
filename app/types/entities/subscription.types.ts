export type SubscriptionType = 'SUBSCRIPTION' | 'FLEX'
export type SubscriptionStatus = 'NOT_ON_SALE' | 'ON_SALE'

export interface ISubscription {
  id: string
  name: string
  type: SubscriptionType
  status: SubscriptionStatus
  isVisible: boolean
  publicUrl: string
  cueboxEditUrl: string
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
}

export type ActionResult<T = undefined> = {
  success: boolean
  data?: T
  error?: string
}
