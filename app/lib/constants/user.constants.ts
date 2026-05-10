export const COL = 'grid-cols-[minmax(0,1fr)_minmax(0,1fr)_7rem_6rem]'

export const COLUMNS = [
  { key: 'firstName', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'createdAt', label: 'Joined', alignRight: false },
  { key: null, label: '', alignRight: true }
]

export const ROLE_OPTIONS = [
  { label: 'All', value: 'ALL' },
  { label: 'Conductor', value: 'CONDUCTOR' },
  { label: 'Admin', value: 'ADMIN' }
]

export const ROLE_ORDER = ['CONDUCTOR', 'ADMIN']

export const ROLE_STYLES = {
  SUPER_USER: 'text-primary-dark border border-primary-dark/30 bg-primary-dark/5',
  CONDUCTOR: 'text-violet-400 border border-violet-400/30 bg-violet-400/5',
  ADMIN: 'text-emerald-400 border border-emerald-400/30 bg-emerald-400/5'
}
