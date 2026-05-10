'use server'

import prisma from '@/prisma/client'

export async function getAdminUsers() {
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
