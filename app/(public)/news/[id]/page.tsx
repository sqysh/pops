import NewsDetailsClient from '@/app/(public)/news/[id]/NewsDetailsClient'
import prisma from '@/prisma/client'
import { getPage } from '@/app/lib/actions/page/getPage'
import { notFound } from 'next/navigation'

export default async function NewsDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [article, page] = await Promise.all([
    prisma.news
      .findUnique({
        where: { id }
      })
      .catch(() => null),
    getPage('news')
  ])

  if (!article || !article.isPublished) notFound()

  return <NewsDetailsClient article={article} content={page?.content} />
}
