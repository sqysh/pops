'use server'

import { ActionResult } from '@/app/types/common.types'
import { getActor } from '../user/getActor'
import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'
import { revalidatePath } from 'next/cache'

export async function deleteSubscription(id: string): Promise<ActionResult> {
  const actor = await getActor()
  if (actor === 'unknown') return { success: false, error: 'Unauthorized' }

  if (!id) return { success: false, error: 'Missing subscription id' }

  try {
    await prisma.subscription.delete({ where: { id } })

    await createLog('INFO', 'Subscription deleted', { id, by: actor })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (err) {
    await createLog('ERROR', 'deleteSubscription failed', { id, error: String(err) })
    return { success: false, error: 'Failed to delete subscription' }
  }
}
