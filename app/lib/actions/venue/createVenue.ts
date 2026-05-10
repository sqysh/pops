'use server'

import prisma from '@/prisma/client'
import { createLog } from '../../../utils/logHelper'
import { getActor } from '../user/getActor'
import { CreateVenueInput } from '../../../types/entities/venue'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { revalidateTag } from 'next/cache'

export async function createVenue(data: CreateVenueInput) {
  if (!data.name) return { success: false, error: 'Venue name is required' }
  if (!data.imageUrl || !data.imageFilename) return { success: false, error: 'Venue image is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const venue = await prisma.venue
    .create({
      data: {
        name: data.name,
        city: data.city ?? 'SARASOTA',
        capacity: data.capacity ?? '',
        accessibility: data.accessibility ?? '',
        immersiveEnvironment: data.immersiveEnvironment ?? '',
        parking: data.parking ?? '',
        imageUrl: data.imageUrl,
        imageFilename: data.imageFilename,
        address: data.address ?? ''
      }
    })
    .catch(() => null)

  if (!venue) return { success: false, error: 'Failed to create venue — please try again' }

  await createLog('info', await buildLogMessage(`created venue "${venue.name}"`, actor, context), {
    venueId: venue.id,
    name: venue.name,
    city: venue.city,
    address: venue.address,
    capacity: venue.capacity,
    createdBy: actor,
    request: context
  }).catch(() => null)

  revalidateTag('dashboard', 'default')

  return { success: true, data: venue }
}
