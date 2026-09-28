'use server'

import z from 'zod'
import { revalidateTag } from 'next/cache'
import { resend } from '../../resend'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { detectSpam } from '@/app/utils/detectSpam'
import { ActionResult } from '@/app/action.types'
import { QuestionFormInput, questionSchema } from '../../schemas/question.schema'
import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'
import { contactSubmissionTemplate } from '../../email-templates/contact-submission'

const MIN_FILL_MS = 2000

export async function createQuestion(data: QuestionFormInput): Promise<ActionResult<null>> {
  const parsed = questionSchema.safeParse(data)

  if (!parsed.success) {
    return {
      success: false,
      error: 'Please check the highlighted fields and try again.',
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      data: null
    }
  }

  const { name, email, message, renderedAt } = parsed.data

  // a real person cannot read the page, type a question and submit inside two
  // seconds, so report success without writing anything and let the bot leave
  if (Date.now() - renderedAt < MIN_FILL_MS) {
    return { success: true, data: null }
  }

  const context = await getRequestContext()
  const isPotentialSpam = detectSpam(message)

  const question = await prisma.question
    .create({
      data: { name, email, message, isPotentialSpam }
    })
    .catch(() => null)

  if (!question) {
    await createLog('error', await buildLogMessage(`failed to create question from "${name}"`, 'public', context), {
      error: 'Prisma create failed',
      name,
      email,
      request: context
    }).catch(() => null)

    return { success: false, error: 'Failed to create question', data: null }
  }

  await createLog('info', await buildLogMessage(`new question submitted by "${question.name}"`, 'public', context), {
    questionId: question.id,
    name: question.name,
    email: question.email,
    isPotentialSpam,
    request: context
  }).catch(() => null)

  await resend.emails
    .send({
      from: 'New Contact Submission <info@thepopsorchestra.org>',
      to: ['info@thepopsorchestra.org'],
      subject: 'New contact form submission',
      html: contactSubmissionTemplate(name)
    })
    .catch(() => null)

  revalidateTag('dashboard', '')

  return { success: true, data: null }
}
