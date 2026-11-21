'use server'

import prisma from '@/prisma/client'
import { createLog } from '../../../utils/logHelper'
import { UpdateVenueInput } from '../../../types/entities/venue'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { revalidateTag } from 'next/cache'
import { requireStaff, denied } from '@/app/lib/auth/guards'

export async function updateVenue(venueId: string, data: UpdateVenueInput) {
  const gate = await requireStaff()
  if (gate.ok === false) return denied(gate)

  if (!venueId) return { success: false, error: 'Venue ID is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const venue = await prisma.venue
    .update({
      where: { id: venueId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.city && { city: data.city }),
        ...(data.capacity !== undefined && { capacity: data.capacity }),
        ...(data.accessibility !== undefined && { accessibility: data.accessibility }),
        ...(data.immersiveEnvironment !== undefined && { immersiveEnvironment: data.immersiveEnvironment }),
        ...(data.parking !== undefined && { parking: data.parking }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.imageFilename !== undefined && { imageFilename: data.imageFilename }),
        ...(data.address !== undefined && { address: data.address })
      }
    })
    .catch(() => null)

  if (!venue) return { success: false, error: 'Failed to update venue — please try again' }

  await createLog('info', await buildLogMessage(`updated venue "${venue.name}"`, actor, context), {
    venueId: venue.id,
    name: venue.name,
    city: venue.city,
    address: venue.address,
    capacity: venue.capacity,
    updatedBy: actor,
    request: context
  }).catch(() => null)

  revalidateTag('dashboard', 'default')

  return { success: true, data: venue }
}
