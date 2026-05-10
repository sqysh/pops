export const COL = 'grid-cols-[1rem_minmax(0,1fr)_minmax(0,1fr)_5rem_4rem]'

export const COLUMNS = [
  { key: null, label: '' },
  { key: 'firstName', label: 'Name' },
  { key: 'position', label: 'Position' },
  { key: 'role', label: 'Role' },
  { key: 'isPublished', label: 'Status', alignRight: true },
  { key: null, label: '', alignRight: true }
]

export const VISIBILITY_OPTIONS = [
  { label: 'All', value: 'ALL' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Hidden', value: 'HIDDEN' }
]

export const TEAM_MEMBER_ROLES = [
  { value: '', label: 'Select Role' },
  { value: 'MUSICIAN', label: 'Musician' },
  { value: 'STAFF', label: 'Staff' },
  { value: 'BOARD_MEMBER', label: 'Board Member' }
]
