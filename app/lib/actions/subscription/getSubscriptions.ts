'use server'

import { ISubscription } from '@/app/types/entities/subscription.types'
import { createLog } from '@/app/utils/logHelper'
import prisma from '@/prisma/client'
import { serialize } from '../../utils/subscription.utils'
import { ActionResult } from '@/app/types/common.types'

export async function getSubscriptions(): Promise<ActionResult<ISubscription[]>> {
  try {
    const rows = await prisma.subscription.findMany({ orderBy: [{ createdAt: 'asc' }] }).catch(() => null)

    if (!rows) return { success: false, error: 'Failed to load subscriptions' }

    return { success: true, data: rows.map(serialize) }
  } catch (err) {
    await createLog('ERROR', 'getSubscriptions failed', { error: String(err) })
    return { success: false, error: 'Failed to load subscriptions' }
  }
}
