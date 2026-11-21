'use server'

import prisma from '@/prisma/client'
import { requireStaff } from '@/app/lib/auth/guards'

export async function acknowledgeApplication(id: string) {
  const gate = await requireStaff()
  if (gate.ok === false) return

  await prisma.campApplication.update({ where: { id }, data: { isNew: false } }).catch(() => null)
}
