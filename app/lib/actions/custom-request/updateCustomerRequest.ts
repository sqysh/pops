'use server'

import prisma from '@/prisma/client'
import { createLog } from '@/app/utils/logHelper'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { CustomRequestStatus } from '@prisma/client'
import { resend } from '../../resend'
import { requireSuper, denied } from '@/app/lib/auth/guards'

export async function updateCustomRequestStatus(id: string, status: CustomRequestStatus) {
  const gate = await requireSuper()
  if (gate.ok === false) return denied(gate)

  if (!id) return { success: false, error: 'Request ID is required' }
  if (!status) return { success: false, error: 'Status is required' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  const request = await prisma.customRequest
    .update({
      where: { id },
      data: { status }
    })
    .catch(() => null)

  if (!request) return { success: false, error: 'Failed to update request status' }

  // Send status update email
  if (request.submittedBy) {
    const statusMessage =
      status === 'COMPLETE'
        ? 'has been completed'
        : status === 'IN_PROGRESS'
          ? 'is now in progress'
          : status === 'DECLINED'
            ? 'has been declined'
            : 'is pending review'

    const { error } = await resend.emails
      .send({
        from: 'The Pops Orchestra <noreply@thepopsorchestra.org>',
        to: request.submittedBy,
        bcc: 'sqysh@sqysh.io',
        subject: `Custom Request Update — ${status}`,
        html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <h2 style="color: #da0032;">Custom Request Status Update</h2>
          <p style="color: #666; font-size: 14px;">Your custom request ${statusMessage}.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          
          <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #da0032; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              ${[
                ['Type', request.changeType],
                ['Page', request.page],
                ['Status', status],
                ['What', request.what],
                ['Why', request.why]
              ]
                .map(
                  ([label, value]) => `
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; width: 100px; vertical-align: top;">${label}</td>
                  <td style="padding: 8px 0; color: #111;">${value}</td>
                </tr>
              `
                )
                .join('')}
            </table>
          </div>

          ${
            status === 'COMPLETE'
              ? `
            <p style="color: #059669; font-weight: 600; margin-top: 20px;">✓ Your request has been completed!</p>
          `
              : status === 'DECLINED'
                ? `
            <p style="color: #dc2626; margin-top: 20px;">If you have questions about this decision, please reply to this email.</p>
          `
                : status === 'IN_PROGRESS'
                  ? `
            <p style="color: #eab308; margin-top: 20px;">⏳ We're working on your request and will update you when it's complete.</p>
          `
                  : ''
          }

          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">
            The Pops Orchestra of Bradenton & Sarasota
          </p>
        </div>
      `
      })
      .catch(() => ({ error: 'Email send failed' }))

    if (error) {
      await createLog('error', await buildLogMessage('Failed to send custom request status email', actor, context), {
        requestId: request.id,
        email: request.submittedBy,
        error,
        request: context
      }).catch(() => null)
    }
  }

  await createLog('info', await buildLogMessage(`updated custom request status to ${status}`, actor, context), {
    requestId: request.id,
    changeType: request.changeType,
    page: request.page,
    what: request.what,
    newStatus: status,
    updatedBy: actor,
    emailSent: !!request.submittedBy,
    request: context
  }).catch(() => null)

  return { success: true, data: request }
}
