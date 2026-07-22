import {
  IPricingTier,
  ISubscription,
  SubscriptionStatus,
  SubscriptionType
} from '@/app/types/entities/subscription.types'

// Grid template for the full-bleed table rows + header.
// name (flex) · type · status · visible · updated
export const COL = 'grid grid-cols-[minmax(0,1fr)_120px_140px_110px_140px] items-center gap-3'

export const COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'isVisible', label: 'Visible', sortable: true },
  { key: 'updatedAt', label: 'Updated', sortable: true }
]

// Filter pills sit on top of the table (mirrors ROLE_OPTIONS pattern)
export const TYPE_OPTIONS = [
  { label: 'All', value: 'ALL' },
  { label: 'Subscriptions', value: 'SUBSCRIPTION' },
  { label: 'Flex', value: 'FLEX' }
]

export const TYPE_ORDER: SubscriptionType[] = ['SUBSCRIPTION', 'FLEX']
export const STATUS_ORDER: SubscriptionStatus[] = ['ON_SALE', 'NOT_ON_SALE']

export const TYPE_LABEL: Record<SubscriptionType, string> = {
  SUBSCRIPTION: 'Subscription',
  FLEX: 'Flex Pass'
}

export const STATUS_LABEL: Record<SubscriptionStatus, string> = {
  ON_SALE: 'On Sale',
  NOT_ON_SALE: 'Coming Soon'
}

// status → color token (consistent with concerts card)
export const STATUS_COLOR: Record<SubscriptionStatus, string> = {
  ON_SALE: '#4ade80',
  NOT_ON_SALE: '#da0032'
}

export const TYPE_SELECT_OPTIONS: { label: string; value: SubscriptionType }[] = [
  { label: 'Season Subscription', value: 'SUBSCRIPTION' },
  { label: 'Flex Pass', value: 'FLEX' }
]

export const STATUS_SELECT_OPTIONS: { label: string; value: SubscriptionStatus }[] = [
  { label: 'On Sale', value: 'ON_SALE' },
  { label: 'Coming Soon', value: 'NOT_ON_SALE' }
]

export const EMPTY_SUBSCRIPTION: ISubscription = {
  id: '',
  name: '',
  type: 'SUBSCRIPTION',
  status: 'NOT_ON_SALE',
  isVisible: false,
  publicUrl: '',
  cueboxEditUrl: '',
  tagline: null,
  description: null,
  pricingTiers: [],
  createdAt: '',
  updatedAt: ''
}
export const ALLOWED_ROLES = ['SUPER_USER', 'ADMIN'] as const

// app/lib/constants/flexLaunch.constants.ts

// Single-ticket / flex on-sale date. Everything date-gated to the flex
// launch keys off this one value — change it here if the date moves.
export const FLEX_LAUNCH = new Date('2026-08-03T00:00:00-04:00') // Aug 3, 2026, ET

export const FLEX_LAUNCH_LABEL = 'August 3'

// True on or after the launch date.
export function isFlexLaunched(now: Date = new Date()): boolean {
  return now.getTime() >= FLEX_LAUNCH.getTime()
}

// ── Flex package pricing ──
// CueBox does not expose subscription pricing to the site, so the flex tiers
// are defined here and rendered on the public page. Matched to a package by a
// substring of its name (case-insensitive).
type FlexPricing = {
  match: string
  note: string
  tiers: IPricingTier[]
}

export const FLEX_PRICING: FlexPricing[] = [
  {
    match: 'three show flex',
    note: '5% off regular pricing',
    tiers: [
      { label: 'General Seating', price: '$99.75' },
      { label: 'Premium Seating', price: '$142.50' },
      { label: 'Ultra Seating', price: '$185.25' }
    ]
  },
  {
    match: 'four show flex',
    note: '10% off regular pricing',
    tiers: [
      { label: 'General Seating', price: '$126' },
      { label: 'Premium Seating', price: '$180' },
      { label: 'Ultra Seating', price: '$234' }
    ]
  }
]

// Returns the fallback flex pricing for a package name, or null if none matches.
export function getFlexPricing(name: string): FlexPricing | null {
  const n = name.toLowerCase()
  return FLEX_PRICING.find((p) => n.includes(p.match)) ?? null
}
