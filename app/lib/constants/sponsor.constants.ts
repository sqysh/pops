export const LEVEL_ORDER = [
  'SEASON_SPONSOR',
  'CONCERT_SPONSOR',
  'GUEST_ARTIST_SPONSOR',
  'PRINCIPAL_SPONSOR',
  'MEDIA_SPONSOR',
  'PARTNER'
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
