import { pageContent as boardMembers } from '@/app/lib/constants/page-content/board-members'
import { pageContent as staff } from '@/app/lib/constants/page-content/staff'
import { pageContent as musicians } from '@/app/lib/constants/page-content/musicians'

/**
 * The team grid and profile pages are shared by three pages, each with its own
 * wording. Every page declares the same fields under its own id prefix.
 */
export const TEAM_PAGES = {
  'board-members': { defs: boardMembers, prefix: 'board_members' },
  staff: { defs: staff, prefix: 'staff' },
  musicians: { defs: musicians, prefix: 'musicians' }
} as const

export type TeamRole = keyof typeof TEAM_PAGES
