'use server'

import { ActionResult, ISubscription, ISubscriptionInput } from '@/app/types/entities/subscription.types'
import { getActor } from '../user/getActor'
import { serialize, validate } from '../../utils/subscription.utils'
import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'
import { revalidatePath } from 'next/cache'

export async function createSubscription(input: ISubscriptionInput): Promise<ActionResult<ISubscription>> {
  const actor = await getActor()
  if (actor === 'unknown') return { success: false, error: 'Unauthorized' }

  const validationError = validate(input)
  if (validationError) return { success: false, error: validationError }

  try {
    const created = await prisma.subscription.create({
      data: {
        name: input.name.trim(),
        type: input.type,
        status: input.status,
        isVisible: input.isVisible,
        publicUrl: input.publicUrl.trim(),
        cueboxEditUrl: input.cueboxEditUrl.trim()
      }
    })

    await createLog('INFO', 'Subscription created', {
      id: created.id,
      name: created.name,
      by: actor
    })

    revalidatePath('/', 'layout')

    return { success: true, data: serialize(created) }
  } catch (err) {
    await createLog('ERROR', 'createSubscription failed', { error: String(err) })
    return { success: false, error: 'Failed to create subscription' }
  }
}
