import 'server-only'
import { redirect } from 'next/navigation'
import { UserRole } from '@prisma/client'
import { auth } from '../auth'

export type Gate = { ok: true; userId: string; role: UserRole; email: string | null } | { ok: false; error: string }

const requireRole = async (allowed?: UserRole[]): Promise<Gate> => {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: 'Unauthorized' }
  if (allowed && !allowed.includes(session.user.role as UserRole)) return { ok: false, error: 'Unauthorized' }

  return {
    ok: true,
    userId: session.user.id,
    role: session.user.role as UserRole,
    email: session.user.email ?? null
  }
}

// For server actions — return the union, caller decides what to do
export const requireAuth = () => requireRole()
export const requireAdmin = () => requireRole([UserRole.ADMIN, UserRole.SUPER_USER])
export const requireSuper = () => requireRole([UserRole.SUPER_USER])

// For pages and layouts — redirect instead of returning
export async function requireAuthPage() {
  const gate = await requireAuth()
  if (!gate.ok) redirect('/auth/login')
  return gate
}

export async function requireAdminPage() {
  const gate = await requireAuthPage()
  if (gate.role !== UserRole.ADMIN && gate.role !== UserRole.SUPER_USER) redirect('/my-pack')
  return gate
}

export async function requireSuperPage() {
  const gate = await requireAuthPage()
  if (gate.role !== UserRole.SUPER_USER) {
    redirect('/v2/dashboard')
  }
  return gate
}
