'use server'

import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '../../auth/guards'
import { createLog } from '@/app/utils/logHelper'

export async function deleteQuestion(id: string) {
  const gate = await requireAdmin()
  if (gate.ok === false) return { success: false, error: gate.error }

  try {
    const question = await prisma.question.delete({ where: { id } })

    await createLog('info', 'Inquiry deleted', {
      questionId: id,
      name: question.name,
      email: question.email,
      deletedBy: gate.userId
    })

    revalidatePath('/v2/questions')
    revalidatePath('/v2/dashboard')

    return { success: true, data: { id } }
  } catch (error) {
    await createLog('error', 'Failed to delete inquiry', { questionId: id, error: String(error) })
    return { success: false, error: 'Could not delete this inquiry. Please try again.' }
  }
}
