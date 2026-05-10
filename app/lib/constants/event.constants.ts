export const COL = 'grid-cols-[minmax(0,1fr)_minmax(0,1fr)_8rem_6rem_3rem]'

export const COLUMNS = [
  { key: 'title', label: 'Title' },
  { key: 'location', label: 'Location' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status', alignRight: true },
  { key: null, label: '', alignRight: true }
]

export const STATUS_OPTIONS = [
  { label: 'All', value: 'ALL' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Cancelled', value: 'CANCELLED' }
]

export const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
  DRAFT: 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  CANCELLED: 'text-red-400 border-red-400/30 bg-red-400/5'
}
