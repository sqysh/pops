import prisma from '@/prisma/client'
import { UsersClient } from './UsersClient'
import { requireStaffPage } from '@/app/lib/auth/guards'

export default async function UsersPage() {
  await requireStaffPage()

  const users = await prisma.user
    .findMany({
      where: { role: { in: ['ADMIN', 'CONDUCTOR'] } },
      orderBy: { createdAt: 'desc' }
    })
    .catch(() => [])

  return <UsersClient users={users} />
}
