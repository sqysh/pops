'use server'

import prisma from '@/prisma/client'

export async function getVenueById(venueId: string) {
  if (!venueId) return { success: false, error: 'Venue ID is required' }

  const venue = await prisma.venue
    .findUnique({
      where: { id: venueId }
    })
    .catch(() => null)

  if (!venue) return { success: false, error: 'Venue not found' }

  return { success: true, data: venue }
}
