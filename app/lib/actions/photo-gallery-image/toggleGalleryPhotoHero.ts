'use server'

import prisma from '@/prisma/client'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { createLog } from '@/app/utils/logHelper'
import { revalidateTag } from 'next/cache'
import { requireStaff, denied } from '@/app/lib/auth/guards'

export async function toggleGalleryPhotoHero(id: string, current: boolean) {
  const gate = await requireStaff()
  if (gate.ok === false) return denied(gate)

  if (!id) return { success: false, error: 'Photo ID is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const photo = await prisma.photoGalleryImage
    .update({
      where: { id },
      data: { isHomeHero: !current }
    })
    .catch(() => null)

  if (!photo) {
    await createLog('error', await buildLogMessage(`failed to toggle hero status for photo "${id}"`, actor, context), {
      photoId: id,
      attempted: !current,
      updatedBy: actor,
      request: context
    }).catch(() => null)

    return { success: false, error: 'Failed to update photo' }
  }

  await createLog('info', await buildLogMessage(`toggled hero status for photo "${id}" to ${!current}`, actor, context), {
    photoId: photo.id,
    isHomeHero: photo.isHomeHero,
    updatedBy: actor,
    request: context
  }).catch(() => null)

  revalidateTag('dashboard', 'default')

  return { success: true, data: photo }
}
