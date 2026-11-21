// Who may do what to user accounts. Pure rules with no imports so they can be
// read, tested and reused anywhere; the guards in guards.ts supply the facts.

export const USER_ROLES = ['ADMIN', 'CONDUCTOR', 'SUPER_USER'] as const
export type Role = (typeof USER_ROLES)[number]

/** Only a super user may edit or delete this team member, whatever the screen shows. */
export const PROTECTED_TEAM_MEMBER_ID = 'cm9kbaggn000dpe0q4oitqt2s'

export const isRole = (value: unknown): value is Role => typeof value === 'string' && USER_ROLES.includes(value as Role)

export type Verdict = { allowed: true } | { allowed: false; reason: string }
const allow: Verdict = { allowed: true }
const deny = (reason: string): Verdict => ({ allowed: false, reason })

interface Party {
  id: string
  role: Role
}

/** Admins and super users manage accounts. Conductors do not. */
const managesUsers = (role: Role) => role === 'ADMIN' || role === 'SUPER_USER'

/** Adding someone to the admin area. New accounts are always plain admins, never anything higher. */
export function canCreateAccount(actor: Party): Verdict {
  return managesUsers(actor.role) ? allow : deny('Only an admin or super user can add people.')
}

/** Changing someone's name. */
export function canEditUserDetails(actor: Party, target: Party): Verdict {
  if (!managesUsers(actor.role)) return deny('Only an admin or super user can edit people.')
  if (target.role === 'SUPER_USER' && actor.role !== 'SUPER_USER') return deny('Only a super user can edit a super user.')
  return allow
}

/**
 * Changing someone's role.
 * - Nobody changes their own role, so no one can promote (or lock out) themselves.
 * - Only a super user can grant, change or remove super user.
 * - An admin can move other people between admin and conductor, nothing more.
 */
export function canChangeRole(actor: Party, target: Party, newRole: Role): Verdict {
  if (!managesUsers(actor.role)) return deny('Only an admin or super user can change roles.')
  if (newRole === target.role) return allow
  if (actor.id === target.id) return deny("You can't change your own role. Ask another admin.")
  if (actor.role === 'SUPER_USER') return allow
  if (target.role === 'SUPER_USER') return deny('Only a super user can change a super user.')
  if (newRole === 'SUPER_USER') return deny('Only a super user can make someone a super user.')
  return allow
}

/** Removing an account. */
export function canDeleteUser(actor: Party, target: Party, superUserCount: number): Verdict {
  if (actor.role !== 'SUPER_USER') return deny('Only a super user can delete people.')
  if (actor.id === target.id) return deny("You can't delete your own account.")
  if (target.role === 'SUPER_USER' && superUserCount <= 1) return deny("The last super user can't be deleted.")
  return allow
}

/** The protected team member may only be edited or deleted by a super user. */
export function canTouchTeamMember(actorRole: Role, memberId: string): Verdict {
  return memberId !== PROTECTED_TEAM_MEMBER_ID || actorRole === 'SUPER_USER'
    ? allow
    : deny('Only a super user can change this team member.')
}
