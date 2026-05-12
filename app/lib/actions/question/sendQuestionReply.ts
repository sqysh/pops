'use server'

import prisma from '@/prisma/client'
import { resend } from '../../resend'
import { replyToQuestionTemplate } from '../../email-templates/reply-to-question.template'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { createLog } from '@/app/utils/logHelper'
import { revalidateTag } from 'next/cache'

interface SendQuestionReplyInput {
  questionId: string
  toEmail: string
  toName: string
  message: string
  originalMessage: string
}

export async function sendQuestionReply(data: SendQuestionReplyInput) {
  if (!data.message.trim()) return { success: false, error: 'Reply message is required' }

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
      { questionId: data.questionId, error: 'Prisma update failed', request: context }
    ).catch(() => null)

    return { success: false, error: 'Connection error — please try again' }
  }

  const emailResult = await resend.emails
    .send({
      from: 'The Pops Orchestra <info@thepopsorchestra.org>',
      to: [data.toEmail],
      replyTo: 'info@thepopsorchestra.org',
      subject: 'Re: Your message to The Pops Orchestra',
      bcc: 'sqysh@sqysh.io',
      html: replyToQuestionTemplate(data.toName, data.message.trim(), data.originalMessage)
    })
    .catch(() => null)

  if (!emailResult) {
    await createLog(
      'error',
      await buildLogMessage(`reply saved but email failed for question "${data.questionId}"`, actor, context),
      { questionId: data.questionId, toEmail: data.toEmail, request: context }
    ).catch(() => null)

    return { success: true, emailFailed: true }
  }

  await createLog(
    'info',
    await buildLogMessage(`reply sent to "${data.toName}" for question "${data.questionId}"`, actor, context),
    { questionId: data.questionId, toEmail: data.toEmail, emailId: emailResult.data?.id, request: context }
  ).catch(() => null)

  revalidateTag('dashboard', '')

  return { success: true }
}
