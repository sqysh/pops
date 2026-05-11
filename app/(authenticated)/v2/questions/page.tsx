import prisma from '@/prisma/client'
import { QuestionsClient } from './QuestionsClient'

export default async function QuestionsPage() {
  const result = await prisma.question
    .findMany({
      orderBy: { createdAt: 'desc' }
    })
    .catch(() => [])

  return <QuestionsClient questions={result} />
}
