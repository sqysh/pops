export const COL = 'grid-cols-[minmax(0,1fr)_minmax(0,1fr)_8rem_6rem_3rem]'

export const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'createdAt', label: 'Joined', alignRight: false },
  { key: 'status', label: 'Status', alignRight: true },
  { key: null, label: '', alignRight: true }
]

export const STATUS_OPTIONS = [
  { label: 'All', value: 'ALL' },
  { label: 'Subscribed', value: 'subscribed' },
  { label: 'Unsubscribed', value: 'unsubscribed' },
  { label: 'Cleaned', value: 'cleaned' },
  { label: 'Pending', value: 'pending' }
]

export const STATUS_COLORS: Record<string, string> = {
  subscribed: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
  unsubscribed: 'text-red-400 border-red-400/30 bg-red-400/5',
  cleaned: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  pending: 'text-sky-400 border-sky-400/30 bg-sky-400/5'
}

export const INTEREST_LABELS = [
  { key: 'isOption1', label: 'Season Tickets' },
  { key: 'isOption2', label: 'Special Events' },
  { key: 'isOption3', label: 'Youth Education' },
  { key: 'isOption4', label: 'Other' }
]
