'use server'

import { prismaD } from '@/prisma/client'
import { requireSuper } from '@/app/lib/auth/guards'

export async function getDatabaseHealth() {
  const gate = await requireSuper()
  if (gate.ok === false) throw new Error(gate.error)

  const [connections, dbSize, cacheHitRate, oldestTransaction] = await Promise.all([
    prismaD.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count
      FROM pg_stat_activity
      WHERE datname = current_database()
    `.catch(() => [{ count: BigInt(0) }]),

    prismaD.$queryRaw<Array<{ size: string }>>`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    `.catch(() => [{ size: 'Unknown' }]),

    prismaD.$queryRaw<Array<{ ratio: number }>>`
      SELECT ROUND(
        sum(heap_blks_hit) / NULLIF(sum(heap_blks_hit) + sum(heap_blks_read), 0) * 100, 2
      ) as ratio
      FROM pg_statio_user_tables
    `.catch(() => [{ ratio: 0 }]),

    prismaD.$queryRaw<Array<{ duration: string | null }>>`
      SELECT MAX(now() - query_start)::text as duration
      FROM pg_stat_activity
      WHERE state = 'active'
        AND query NOT LIKE '%pg_stat_activity%'
        AND query_start IS NOT NULL
    `.catch(() => [{ duration: null }])
  ])

  const connectionCount = Number(connections[0]?.count || 0)
  const cacheHit = Number(cacheHitRate[0]?.ratio || 0)
  const duration = oldestTransaction[0]?.duration ?? null
  const durationClean = duration === '00:00:00' || duration === '-' ? null : duration

  return {
    activeConnections: connectionCount,
    maxConnections: 901,
    dbSize: dbSize[0]?.size ?? 'Unknown',
    cacheHitRate: cacheHit,
    cacheHitHealthy: cacheHit >= 85,
    healthy: connectionCount < 901 && cacheHit >= 85,
    oldestTransaction: durationClean,
    oldestTransactionWarning: durationClean ? durationClean > '00:00:30' : false
  }
}
