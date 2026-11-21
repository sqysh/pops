import PublicNewsClient from '@/app/(public)/news/PublicNewsClient'
import prisma from '@/prisma/client'
import { getPage } from '@/app/lib/actions/page/getPage'

export default async function NewsPage() {
  const [news, page] = await Promise.all([
    prisma.news
      .findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' }
      })
      .catch(() => []),
    getPage('news')
  ])
  return <PublicNewsClient news={news} content={page?.content} />
}
