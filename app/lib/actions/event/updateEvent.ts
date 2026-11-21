'use server'

import { EventInput } from '@/app/types/entities/event'
import { getActor } from '../user/getActor'
import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { revalidateTag } from 'next/cache'
import { requireStaff, denied } from '@/app/lib/auth/guards'

export async function updateEvent(id: string, data: EventInput) {
  const gate = await requireStaff()
  if (gate.ok === false) return denied(gate)

  if (!id) return { success: false, error: 'Event ID is required' }
  if (!data.title) return { success: false, error: 'Title is required' }
  if (!data.date) return { success: false, error: 'Date is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const event = await prisma.event
    .update({
      where: { id },
      data: {
        title: data.title,
        date: new Date(data.date),
        location: data.location ?? '',
        description: data.description ?? '',
        status: data.status ?? 'DRAFT'
      }
    })
    .catch(() => null)

  if (!event) return { success: false, error: 'Failed to update event' }

  await createLog('info', await buildLogMessage(`updated event "${event.title}"`, actor, context), {
    eventId: event.id,
    title: event.title,
    date: event.date,
    location: event.location,
    status: event.status,
    updatedBy: actor,
    request: context
  }).catch(() => null)

  revalidateTag('dashboard', 'default')

  return { success: true, data: event }
}
