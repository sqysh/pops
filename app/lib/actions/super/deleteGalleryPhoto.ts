'use server'

import prisma from '@/prisma/client'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { createLog } from '@/app/utils/logHelper'
import { revalidateTag } from 'next/cache'
import { requireSuper, denied } from '@/app/lib/auth/guards'

export async function deleteGalleryPhoto(id: string) {
  const gate = await requireSuper()
  if (gate.ok === false) return denied(gate)

  if (!id) return { success: false, error: 'Photo ID is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const photo = await prisma.photoGalleryImage
    .delete({
      where: { id }
    })
    .catch(() => null)

  if (!photo) {
    await createLog('error', await buildLogMessage(`failed to delete photo "${id}"`, actor, context), {
      photoId: id,
      updatedBy: actor,
      request: context
    }).catch(() => null)

    return { success: false, error: 'Failed to delete photo' }
  }

  await createLog('info', await buildLogMessage(`deleted photo "${id}"`, actor, context), {
    photoId: id,
    filename: photo.filename,
    updatedBy: actor,
    request: context
  }).catch(() => null)

  revalidateTag('super-dashboard', 'default')
  return { success: true }
}
