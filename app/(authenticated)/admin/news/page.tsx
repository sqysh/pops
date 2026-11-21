import prisma from '@/prisma/client'
import { NewsClient } from './NewsClient'
import { requireStaffPage } from '@/app/lib/auth/guards'

export default async function NewsPage() {
  await requireStaffPage()

  const news = await prisma.news
    .findMany({
      orderBy: { createdAt: 'desc' }
    })
    .catch(() => [])

  return <NewsClient news={news} />
}
