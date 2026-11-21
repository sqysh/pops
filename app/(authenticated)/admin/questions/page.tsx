import prisma from '@/prisma/client'
import { QuestionsClient } from './QuestionsClient'
import { requireStaffPage } from '@/app/lib/auth/guards'

export default async function QuestionsPage() {
  await requireStaffPage()

  const result = await prisma.question
    .findMany({
      orderBy: { createdAt: 'desc' }
    })
    .catch(() => [])

  return <QuestionsClient questions={result} />
}
