import 'server-only'
import { redirect } from 'next/navigation'
import { UserRole } from '@prisma/client'
import prisma from '@/prisma/client'
import { auth } from '../auth'

/**
 * The one place that decides who is signed in and what they may do.
 *
 * Every check starts from the signed session but takes the role from the
 * database, never from the token: a person who was demoted or deleted loses
 * access on their very next request instead of keeping it until their sign-in
 * expires. Anything that cannot be confirmed is refused.
 *
 *   const gate = await requireAdmin()
 *   if (gate.ok === false) return denied(gate)
 *   // gate.userId, gate.role, gate.email, gate.name
 */

export type Gate = { ok: true; userId: string; role: UserRole; email: string | null; name: string } | { ok: false; error: string }

const SIGN_IN_AGAIN = 'Please sign in again to continue.'
const NOT_ALLOWED = 'You do not have permission to do that.'

async function requireRole(allowed?: readonly UserRole[]): Promise<Gate> {
  const session = await auth()
  const id = session?.user?.id
  if (!id) return { ok: false, error: SIGN_IN_AGAIN }

  const user = await prisma.user
    .findUnique({ where: { id }, select: { id: true, email: true, role: true, firstName: true, lastName: true } })
    .catch(() => null)

  // signed in once, but the account is gone (or the database cannot confirm it)
  if (!user) return { ok: false, error: SIGN_IN_AGAIN }
  if (allowed && !allowed.includes(user.role)) return { ok: false, error: NOT_ALLOWED }

  return {
    ok: true,
    userId: user.id,
    role: user.role,
    email: user.email,
    name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email
  }
}

const STAFF = [UserRole.ADMIN, UserRole.CONDUCTOR, UserRole.SUPER_USER] as const
const ADMINS = [UserRole.ADMIN, UserRole.SUPER_USER] as const
const SUPERS = [UserRole.SUPER_USER] as const

// For server actions: return the result, the caller decides what to do with it.
/** Signed in with any role that can use the admin area (admin, conductor, super user). */
export const requireStaff = () => requireRole(STAFF)
/** Admin or super user. */
export const requireAdmin = () => requireRole(ADMINS)
/** Super user only. */
export const requireSuper = () => requireRole(SUPERS)

/** The shape every action already returns on failure. */
export const denied = (gate: Extract<Gate, { ok: false }>) => ({ success: false as const, error: gate.error })
/** Same, for actions typed as ActionResult. */
export const deniedResult = (gate: Extract<Gate, { ok: false }>) => ({
  success: false as const,
  error: gate.error,
  data: null
})

// For pages and layouts: send the person to sign in instead.
async function requirePage(check: () => Promise<Gate>, fallback: string) {
  const gate = await check()
  if (gate.ok === false) redirect(gate.error === SIGN_IN_AGAIN ? '/login' : fallback)
  return gate
}

export const requireStaffPage = () => requirePage(requireStaff, '/login')
export const requireAdminPage = () => requirePage(requireAdmin, '/admin/dashboard')
export const requireSuperPage = () => requirePage(requireSuper, '/admin/dashboard')
