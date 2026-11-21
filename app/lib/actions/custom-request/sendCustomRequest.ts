'use server'

import prisma from '@/prisma/client'
import { auth } from '../../auth'
import { resend } from '../../resend'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { createLog } from '@/app/utils/logHelper'
import { revalidateTag } from 'next/cache'
import { requireStaff, denied } from '@/app/lib/auth/guards'

interface RequestInput {
  changeType: string
  page: string
  what: string
  why: string
  example: string
  urgency: string
}

export async function sendCustomRequest(data: RequestInput) {
  const gate = await requireStaff()
  if (gate.ok === false) return denied(gate)

  const session = await auth()
  const submittedBy = session?.user?.email ?? 'unknown'

  const [context] = await Promise.all([getRequestContext()])

  const request = await prisma.customRequest
    .create({
      data: {
        changeType: data.changeType,
        page: data.page,
        what: data.what,
        why: data.why,
        example: data.example ?? '',
        urgency: data.urgency,
        submittedBy
      }
    })
    .catch(() => null)

  if (!request) return { success: false, error: 'Failed to save request' }

  await createLog(
    'info',
    await buildLogMessage(`submitted a custom request — ${data.changeType} on ${data.page}`, submittedBy, context),
    {
      requestId: request.id,
      changeType: data.changeType,
      page: data.page,
      urgency: data.urgency,
      what: data.what,
      why: data.why,
      example: data.example ?? null,
      submittedBy,
      request: context
    }
  ).catch(() => null)

  const { error } = await resend.emails.send({
    from: 'The Pops Admin <noreply@thepopsorchestra.org>',
    to: 'sqysh@sqysh.io',
    subject: `[Pops] Custom Request — ${data.changeType} · ${data.urgency}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <h2 style="color: #da0032;">New Custom Request</h2>
        <p style="color: #666; font-size: 12px;">Submitted by ${session?.user?.name ?? 'Admin'} (${session?.user?.email ?? ''})</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${[
            ['Type', data.changeType],
            ['Page', data.page],
            ['Urgency', data.urgency],
            ['What', data.what],
            ['Why', data.why],
            ['Example / Reference', data.example || '—']
          ]
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding: 10px 12px; font-weight: 600; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; width: 140px; vertical-align: top; border-bottom: 1px solid #f0f0f0;">${label}</td>
              <td style="padding: 10px 12px; color: #111; border-bottom: 1px solid #f0f0f0;">${value}</td>
            </tr>
          `
            )
            .join('')}
        </table>
      </div>
    `
  })

  if (error) return { success: false, error: 'Failed to send request' }

  revalidateTag('dashboard', 'default')

  return { success: true, data: request }
}
