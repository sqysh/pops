'use server'

import prisma from '@/prisma/client'
import { createLog } from '../../../utils/logHelper'
import { getActor } from '../user/getActor'
import { CreateSponsorInput } from '../../../types/entities/sponsor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { revalidateTag } from 'next/cache'
import { requireStaff, denied } from '@/app/lib/auth/guards'

export async function createSponsor(data: CreateSponsorInput) {
  const gate = await requireStaff()
  if (gate.ok === false) return denied(gate)

  if (!data.name) return { success: false, error: 'Sponsor name is required' }
  if (!data.filePath || !data.filename) return { success: false, error: 'Sponsor image is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const sponsor = await prisma.sponsor
    .create({
      data: {
        name: data.name,
        filePath: data.filePath,
        filename: data.filename,
        externalLink: data.externalLink ?? '',
        level: data.level,
        amount: data.amount ?? 0,
        isActive: data.isActive ?? true
      }
    })
    .catch(() => null)

  if (!sponsor) return { success: false, error: 'Failed to create sponsor' }

  await createLog('info', await buildLogMessage(`created sponsor "${sponsor.name}"`, actor, context), {
    sponsorId: sponsor.id,
    name: sponsor.name,
    level: sponsor.level,
    amount: sponsor.amount,
    isActive: sponsor.isActive,
    createdBy: actor,
    request: context
  }).catch(() => null)

  revalidateTag('dashboard', 'default')

  return { success: true, data: sponsor }
}
