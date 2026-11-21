'use server'

import prisma from '@/prisma/client'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { createLog } from '@/app/utils/logHelper'
import { revalidateTag } from 'next/cache'
import { requireStaff, denied } from '@/app/lib/auth/guards'

export async function createVenueQuick({ name }: { name: string }) {
  const gate = await requireStaff()
  if (gate.ok === false) return denied(gate)

  if (!name) return { success: false, error: 'Venue name is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const venue = await prisma.venue
    .create({
      data: {
        name,
        capacity: '',
        accessibility: '',
        immersiveEnvironment: '',
        parking: '',
        imageUrl: '',
        imageFilename: '',
        address: ''
      }
    })
    .catch(() => null)

  if (!venue) {
    await createLog('error', await buildLogMessage(`failed to quick-create venue "${name}"`, actor, context), {
      name,
      createdBy: actor,
      request: context
    }).catch(() => null)

    return { success: false, error: 'Failed to create venue' }
  }

  await createLog('info', await buildLogMessage(`quick-created venue "${venue.name}"`, actor, context), {
    venueId: venue.id,
    name: venue.name,
    createdBy: actor,
    request: context
  }).catch(() => null)

  revalidateTag('dashboard', 'default')

  return { success: true, data: venue }
}
