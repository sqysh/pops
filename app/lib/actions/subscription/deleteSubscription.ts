'use server'

import { ActionResult } from '@/app/types/common.types'
import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'
import { revalidatePath } from 'next/cache'
import { SUBSCRIPTION_PAGES } from '../../constants/subscription.constants'
import { requireAdmin, deniedResult } from '@/app/lib/auth/guards'

export async function deleteSubscription(id: string): Promise<ActionResult> {
  const gate = await requireAdmin()
  if (gate.ok === false) return deniedResult(gate)

  const actor = gate.name

  if (!id) return { success: false, error: 'Missing subscription id' }

  try {
    await prisma.subscription.delete({ where: { id } })

    await createLog('INFO', 'Subscription deleted', { id, by: actor })

    SUBSCRIPTION_PAGES.forEach((path) => revalidatePath(path))

    return { success: true }
  } catch (err) {
    await createLog('ERROR', 'deleteSubscription failed', { id, error: String(err) })
    return { success: false, error: 'Failed to delete subscription' }
  }
}
