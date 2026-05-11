'use server'

import prisma from '@/prisma/client'

export async function acknowledgeApplication(id: string) {
  await prisma.campApplication.update({ where: { id }, data: { isNew: false } }).catch(() => null)
}
