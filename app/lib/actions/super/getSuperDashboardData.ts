'use server'

import { getDatabaseHealth } from './getDatabaseHealth'
import { getSuperCustomRequests } from './inividualCachedQueries'
import { requireSuper } from '@/app/lib/auth/guards'

export async function getSuperDashboardData() {
  const gate = await requireSuper()
  if (gate.ok === false) throw new Error(gate.error)

  const [customRequests, dbHealth] = await Promise.all([getSuperCustomRequests(), getDatabaseHealth()])
  return { customRequests, dbHealth }
}
