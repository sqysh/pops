'use server'

import prisma from '@/prisma/client'
import { createLog } from '../../../utils/logHelper'
import { UpdateSponsorInput } from '@/app/types/entities/sponsor'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { revalidateTag } from 'next/cache'
import { requireStaff, denied } from '@/app/lib/auth/guards'

export async function updateSponsor(id: string, data: UpdateSponsorInput) {
  const gate = await requireStaff()
  if (gate.ok === false) return denied(gate)

  if (!id) return { success: false, error: 'Sponsor ID is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const sponsor = await prisma.sponsor
    .update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.filePath !== undefined && { filePath: data.filePath }),
        ...(data.filename !== undefined && { filename: data.filename }),
        ...(data.externalLink !== undefined && { externalLink: data.externalLink }),
        ...(data.level !== undefined && { level: data.level }),
        ...(data.amount !== undefined && { amount: Math.round(data.amount) }),
        ...(data.isActive !== undefined && { isActive: data.isActive })
      }
    })
    .catch(() => null)

  if (!sponsor) {
    await createLog('error', await buildLogMessage(`failed to update sponsor "${id}"`, actor, context), {
      sponsorId: id,
      attempted: data,
      updatedBy: actor,
      request: context
    }).catch(() => null)

    return { success: false, error: 'Failed to update sponsor' }
  }

  await createLog('info', await buildLogMessage(`updated sponsor "${sponsor.name}"`, actor, context), {
    sponsorId: sponsor.id,
    name: sponsor.name,
    level: sponsor.level,
    isActive: sponsor.isActive,
    updatedBy: actor,
    request: context
  }).catch(() => null)

  revalidateTag('dashboard', 'default')

  return { success: true, data: sponsor }
}
