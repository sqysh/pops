export const LEVEL_ORDER = [
  'Season Sponsor',
  'Concert Sponsor',
  'Guest Artist Sponsor',
  'Principal Sponsor',
  'Media Sponsor',
  'Partner'
]

export const EMPTY_SPONSOR_FORM = {
  name: '',
  level: LEVEL_ORDER[0],
  amount: '',
  externalLink: '',
  isActive: true
}

export const COL = 'grid-cols-[2rem_3rem_1fr_9rem_7rem_5rem]'

export const COLUMNS = [
  { key: null, label: '#' },
  { key: null, label: 'Logo' },
  { key: 'name', label: 'Name' },
  { key: 'level', label: 'Level' },
  { key: 'amount', label: 'Amount' },
  { key: 'isActive', label: 'Status' }
]

export const ACTIVE_OPTIONS = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' }
]

const LEVELS: Record<string, { label: string; tone: string }> = {
  'Season Sponsor': { label: 'Season', tone: 'text-amber-800 bg-amber-50 ring-amber-200' },
  'Concert Sponsor': { label: 'Concert', tone: 'text-orange-800 bg-orange-50 ring-orange-200' },
  'Guest Artist Sponsor': { label: 'Guest Artist', tone: 'text-violet-700 bg-violet-50 ring-violet-200' },
  'Principal Sponsor': { label: 'Principal', tone: 'text-sky-700 bg-sky-50 ring-sky-200' },
  'Media Sponsor': { label: 'Media', tone: 'text-emerald-700 bg-emerald-50 ring-emerald-200' },
  Partner: { label: 'Partner', tone: 'text-neutral-600 bg-neutral-100 ring-neutral-300' }
}

const NEUTRAL = 'text-neutral-600 bg-neutral-100 ring-neutral-300'

export const levelColor = (level: string) => LEVELS[level]?.tone ?? NEUTRAL

export const formatLevel = (level: string) => LEVELS[level]?.label ?? level
