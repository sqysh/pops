import { TableColumn } from '@/app/(authenticated)/v2/_components/TableShell'

/** Grid template shared by the column headers and every row, so they align. */
export const COL = 'grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)_minmax(0,2fr)_120px_130px]'

export const COLUMNS: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: null, label: 'Message' },
  { key: 'createdAt', label: 'Received' },
  { key: 'hasResponded', label: 'Status', alignRight: true }
]

export const STATUS_OPTIONS = [
  { label: 'All', value: 'ALL' },
  { label: 'Needs reply', value: 'PENDING' },
  { label: 'Replied', value: 'RESPONDED' }
]
