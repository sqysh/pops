'use server'

import prisma from '@/prisma/client'
import { createLog } from '../../../utils/logHelper'
import { contactSubmissionTemplate } from '../../email-templates/contact-submission'
import { resend } from '../../resend'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { revalidateTag } from 'next/cache'

interface CreateQuestionInput {
  name: string
  email?: string
  message?: string
  hasResponded?: boolean
}

export async function createQuestion(data: CreateQuestionInput) {
  if (!data.name) return { success: false, error: 'Name is required' }
  if (!data.message) return { success: false, error: 'Message is required' }

  const context = await getRequestContext()

  const question = await prisma.question
    .create({
      data: {
        name: data.name,
        email: data.email || '',
        message: data.message
      }
    })
    .catch(() => null)

  if (!question) {
    await createLog(
      'error',
      await buildLogMessage(`failed to create question from "${data.name}"`, 'public', context),
      {
        error: 'Prisma create failed',
        name: data.name,
        email: data.email,
        request: context
      }
    ).catch(() => null)

    return { success: false, error: 'Failed to create question' }
  }

  await createLog('info', await buildLogMessage(`new question submitted by "${question.name}"`, 'public', context), {
    questionId: question.id,
    name: question.name,
    email: question.email,
    request: context
  }).catch(() => null)

  await resend.emails
    .send({
      from: 'New Contact Submission <noreply@thepopsorchestra.org>',
      to: ['sqysh@sqysh.io'],
      // to: ['info@thepopsorchestra.org', 'robyn@thepopsorchestra.org'],
      subject: 'New contact form submission',
      html: contactSubmissionTemplate(data.name)
    })
    .catch(() => null)

  revalidateTag('dashboard', '')

  return { success: true }
}
