'use server'

import { ActionResult, ISubscription, ISubscriptionInput } from '@/app/types/entities/subscription.types'
import { getActor } from '../user/getActor'
import { serialize, validate } from '../../utils/subscription.utils'
import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'
import { revalidatePath } from 'next/cache'

export async function updateSubscription(id: string, input: ISubscriptionInput): Promise<ActionResult<ISubscription>> {
  const actor = await getActor()
  if (actor === 'unknown') return { success: false, error: 'Unauthorized' }

  if (!id) return { success: false, error: 'Missing subscription id' }

  const validationError = validate(input)
  if (validationError) return { success: false, error: validationError }

  try {
    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        name: input.name.trim(),
        type: input.type,
        status: input.status,
        isVisible: input.isVisible,
        publicUrl: input.publicUrl.trim(),
        cueboxEditUrl: input.cueboxEditUrl.trim()
      }
    })

    await createLog('INFO', 'Subscription updated', {
      id: updated.id,
      name: updated.name,
      by: actor
    })

    revalidatePath('/', 'layout')

    return { success: true, data: serialize(updated) }
  } catch (err) {
    await createLog('ERROR', 'updateSubscription failed', { id, error: String(err) })
    return { success: false, error: 'Failed to update subscription' }
  }
}
