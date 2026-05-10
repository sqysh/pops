import { SortDir } from '@/app/types/common.types'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronUp className="w-2.5 h-2.5 opacity-20" />
  return dir === 'asc' ? (
    <ChevronUp className="w-2.5 h-2.5 text-primary-dark" />
  ) : (
    <ChevronDown className="w-2.5 h-2.5 text-primary-dark" />
  )
}
