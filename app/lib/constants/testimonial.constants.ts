export const COL = 'grid-cols-[minmax(0,1fr)_minmax(0,1fr)_5rem_5rem]'

export const COLUMNS = [
  { key: 'author', label: 'Author' },
  { key: 'quote', label: 'Quote' },
  { key: 'title', label: 'Title' },
  { key: 'isPublished', label: 'Status', alignRight: true },
  { key: null, label: '', alignRight: true }
]

export const VISIBILITY_OPTIONS = [
  { label: 'All', value: 'ALL' },
  { label: 'Live', value: 'LIVE' },
  { label: 'Draft', value: 'DRAFT' }
]
