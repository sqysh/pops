import { TeamMember } from '@prisma/client'

export type Role = 'BOARD_MEMBER' | 'STAFF' | 'MUSICIAN'

export const ROLE_LABELS: Record<Role, string> = {
  BOARD_MEMBER: 'Board Members',
  STAFF: 'Staff',
  MUSICIAN: 'Musicians'
}

export const ROLES: Role[] = ['BOARD_MEMBER', 'STAFF', 'MUSICIAN']

export interface TeamClientProps {
  teamMembers: TeamMember[]
}
