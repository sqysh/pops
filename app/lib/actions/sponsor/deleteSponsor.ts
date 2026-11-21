'use server'

import prisma from '@/prisma/client'
import { createLog } from '../../../utils/logHelper'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { revalidateTag } from 'next/cache'
import { denied, requireSuper } from '@/app/lib/auth/guards'

export async function deleteSponsor(id: string) {
  const gate = await requireSuper()
  if (gate.ok === false) return denied(gate)

  if (!id) return { success: false, error: 'Sponsor ID is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const sponsor = await prisma.sponsor.delete({ where: { id } }).catch(() => null)

  if (!sponsor) return { success: false, error: 'Failed to delete sponsor' }

  await createLog('info', await buildLogMessage(`deleted sponsor "${sponsor.name}"`, actor, context), {
    sponsorId: sponsor.id,
    name: sponsor.name,
    level: sponsor.level,
    deletedBy: actor,
    request: context
  }).catch(() => null)

  revalidateTag('super-sponsors', '')
  return { success: true }
}
