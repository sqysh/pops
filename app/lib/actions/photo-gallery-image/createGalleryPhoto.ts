'use server'

import prisma from '@/prisma/client'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { createLog } from '@/app/utils/logHelper'
import { revalidateTag } from 'next/cache'
import { requireStaff, denied } from '@/app/lib/auth/guards'

export async function createGalleryPhoto({ imageUrl, imageFilename }: { imageUrl: string; imageFilename: string }) {
  const gate = await requireStaff()
  if (gate.ok === false) return denied(gate)

  if (!imageUrl || !imageFilename) return { success: false, error: 'Image is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const photo = await prisma.photoGalleryImage
    .create({
      data: { imageUrl, imageFilename }
    })
    .catch(() => null)

  if (!photo) {
    await createLog('error', await buildLogMessage(`failed to create gallery photo "${imageFilename}"`, actor, context), {
      imageFilename,
      updatedBy: actor,
      request: context
    }).catch(() => null)

    return { success: false, error: 'Failed to save photo' }
  }

  await createLog('info', await buildLogMessage(`created gallery photo "${imageFilename}"`, actor, context), {
    photoId: photo.id,
    imageFilename: photo.imageFilename,
    updatedBy: actor,
    request: context
  }).catch(() => null)

  revalidateTag('dashboard', 'default')

  return { success: true, data: photo }
}
