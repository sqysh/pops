'use server'

import prisma from '@/prisma/client'
import { requireAdmin } from '@/app/lib/auth/guards'

export async function getAdminUsers() {
  const gate = await requireAdmin()
  if (gate.ok === false) return []

  return prisma.user
    .findMany({
      where: {
        role: { in: ['ADMIN', 'CONDUCTOR'] }
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      },
      orderBy: { role: 'asc' }
    })
    .catch(() => [])
}
