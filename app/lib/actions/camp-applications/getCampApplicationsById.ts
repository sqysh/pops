'use server'

import prisma from '@/prisma/client'
import { requireStaff } from '@/app/lib/auth/guards'

export async function getCampApplicationsById() {
  const gate = await requireStaff()
  if (gate.ok === false) return []

  return prisma.campApplication
    .findMany({
      where: { id: gate.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        Student: true,
        Address: true,
        Parent: true
      }
    })
    .catch(() => [])
}
