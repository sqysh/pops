'use server'

import prisma from '@/prisma/client'
import { requireStaff, denied } from '@/app/lib/auth/guards'

export async function createCampApplicationsSetting() {
  const gate = await requireStaff()
  if (gate.ok === false) return denied(gate)

  const setting = await prisma.siteSetting
    .upsert({
      where: { key: 'campApplicationsEnabled' },
      update: {},
      create: {
        key: 'campApplicationsEnabled',
        name: 'Camp Applications',
        value: false
      }
    })
    .catch(() => null)

  if (!setting) return { success: false, error: 'Failed to create setting' }

  return { success: true, data: setting }
}
