'use server'

import prisma from '@/prisma/client'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { createLog } from '@/app/utils/logHelper'
import { revalidatePath } from 'next/cache'

export async function toggleSiteSetting(key: string, value: boolean) {
  if (!key) return { success: false, error: 'Setting key is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const setting = await prisma.siteSetting
    .update({
      where: { key },
      data: { value }
    })
    .catch(() => null)

  if (!setting) {
    await createLog(
      'error',
      await buildLogMessage(`failed to toggle site setting "${key}" to ${value}`, actor, context),
      {
        key,
        attempted: value,
        updatedBy: actor,
        request: context
      }
    ).catch(() => null)

    return { success: false, error: 'Failed to update setting' }
  }

  await createLog('info', await buildLogMessage(`toggled site setting "${key}" to ${value}`, actor, context), {
    key,
    value,
    updatedBy: actor,
    request: context
  }).catch(() => null)

  revalidatePath('/', 'layout')

  return { success: true, data: setting }
}
