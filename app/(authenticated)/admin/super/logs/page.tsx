import LogsClient from '@/app/(authenticated)/admin/super/logs/LogsClient'
import { requireSuperPage } from '@/app/lib/auth/guards'
import prisma from '@/prisma/client'

export default async function SuperLogsPage() {
  await requireSuperPage()

  const logs = await prisma.log
    .findMany({
      orderBy: { createdAt: 'desc' },
      take: 500
    })
    .catch(() => [])

  const infoLogs = logs.filter((l) => l.level === 'info')
  const errorLogs = logs.filter((l) => l.level === 'error')
  const warnLogs = logs.filter((l) => l.level === 'warn')

  return <LogsClient infoLogs={infoLogs} errorLogs={errorLogs} warnLogs={warnLogs} />
}
