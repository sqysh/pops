import prisma from '@/prisma/client'
import { NewsClient } from './NewsClient'

export default async function NewsPage() {
  const news = await prisma.news
    .findMany({
      orderBy: { createdAt: 'desc' }
    })
    .catch(() => [])

  return <NewsClient news={news} />
}
