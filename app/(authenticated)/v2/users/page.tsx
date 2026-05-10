import prisma from '@/prisma/client'
import { UsersClient } from './UsersClient'

export default async function UsersPage() {
  const users = await prisma.user
    .findMany({
      where: { role: { in: ['ADMIN', 'CONDUCTOR'] } },
      orderBy: { createdAt: 'desc' }
    })
    .catch(() => [])

  return <UsersClient users={users} />
}
