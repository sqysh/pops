'use server'

import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { getActor } from '../user/getActor'
import { denied, requireSuper } from '@/app/lib/auth/guards'
import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'
import { revalidateTag } from 'next/cache'

export async function deleteEvent(id: string) {
  const gate = await requireSuper()
  if (gate.ok === false) return denied(gate)

  if (!id) return { success: false, error: 'Event ID is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const event = await prisma.event.delete({ where: { id } }).catch(() => null)
  if (!event) return { success: false, error: 'Failed to delete event' }

  await createLog('info', await buildLogMessage(`deleted event "${event.title}"`, actor, context), {
    eventId: event.id,
    title: event.title,
    deletedBy: actor,
    request: context
  }).catch(() => null)

  revalidateTag('super-events', '')
  return { success: true }
}
