'use server'

import prisma from '@/prisma/client'
import { createLog } from '../../../utils/logHelper'
import { requireStaff } from '@/app/lib/auth/guards'

export async function getCampApplicationById(id: string) {
  const gate = await requireStaff()
  if (gate.ok === false) return null

  try {
    return await prisma.campApplication.findFirst({
      where: {
        id
      },
      include: { Student: true, Address: true, Parent: true }
    })
  } catch (error) {
    createLog('error', '[getCampApplicationById]', error)
    return null
  }
}
