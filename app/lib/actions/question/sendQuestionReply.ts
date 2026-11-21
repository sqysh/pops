'use server'

import prisma from '@/prisma/client'
import { resend } from '../../resend'
import { replyToQuestionTemplate } from '../../email-templates/reply-to-question.template'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { createLog } from '@/app/utils/logHelper'
import { revalidateTag } from 'next/cache'
import { requireStaff, denied } from '@/app/lib/auth/guards'

interface SendQuestionReplyInput {
  questionId: string
  /** Ignored: the reply always goes to the address stored on the inquiry. */
  toEmail?: string
  /** Ignored, as above. */
  toName?: string
  message: string
  /** Ignored, as above. */
  originalMessage?: string
}

export async function sendQuestionReply(data: SendQuestionReplyInput) {
  const gate = await requireStaff()
  if (gate.ok === false) return denied(gate)

  if (!data?.questionId) return { success: false, error: 'Question ID is required' }
  if (!data.message?.trim()) return { success: false, error: 'Reply message is required' }

  // Reply to the person who wrote in, using what is stored on their inquiry. The address, name and
  // original message are never taken from the request, so this cannot be used to email anyone else.
  const inquiry = await prisma.question
    .findUnique({ where: { id: data.questionId }, select: { email: true, name: true, message: true } })
    .catch(() => null)
  if (!inquiry) return { success: false, error: 'Inquiry not found' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const question = await prisma.question
    .update({
      where: { id: data.questionId },
      data: {
        replyMessage: data.message.trim(),
        hasResponded: true,
        isPotentialSpam: false
      }
    })
    .catch(async (e) => {
      await createLog(
        'error',
        await buildLogMessage(`prisma error updating question "${data.questionId}" with reply`, 'admin', context),
        { questionId: data.questionId, error: e?.message ?? 'unknown', request: context }
      ).catch(() => null)
      return null
    })

  if (!question) {
    await createLog(
      'error',
      await buildLogMessage(`failed to update question "${data.questionId}" with reply`, 'admin', context),
      { questionId: data.questionId, error: 'Prisma returned null — check catch log above', request: context }
    ).catch(() => null)

    return { success: false, error: 'Connection error — please try again' }
  }

  const emailResult = await resend.emails
    .send({
      from: 'The Pops Orchestra <info@thepopsorchestra.org>',
      to: [inquiry.email],
      replyTo: 'info@thepopsorchestra.org',
      subject: 'Re: Your message to The Pops Orchestra',
      html: replyToQuestionTemplate(inquiry.name, data.message.trim(), inquiry.message)
    })
    .catch(() => null)

  if (!emailResult) {
    await createLog(
      'error',
      await buildLogMessage(`reply saved but email failed for question "${data.questionId}"`, actor, context),
      { questionId: data.questionId, toEmail: inquiry.email, request: context }
    ).catch(() => null)

    return { success: true, emailFailed: true }
  }

  await createLog(
    'info',
    await buildLogMessage(`reply sent to "${inquiry.name}" for question "${data.questionId}"`, actor, context),
    { questionId: data.questionId, toEmail: inquiry.email, emailId: emailResult.data?.id, request: context }
  ).catch(() => null)

  revalidateTag('dashboard', '')

  return { success: true }
}
