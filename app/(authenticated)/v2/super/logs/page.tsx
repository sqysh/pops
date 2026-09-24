import LogsClient from '@/app/(authenticated)/v2/super/logs/LogsClient'
import { auth } from '@/app/lib/auth'
import prisma from '@/prisma/client'
import { redirect } from 'next/navigation'

export default async function SuperLogsPage() {
  const session = await auth()

  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user
    .findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })
    .catch(() => null)

  if (user?.role !== 'SUPER_USER') redirect('/v2/dashboard')

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
