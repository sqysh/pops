'use server'

import prisma from '@/prisma/client'
import { adminWelcomeTemplate } from '../../email-templates/admin-welcome.template'
import { getActor } from './getActor'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { createLog } from '@/app/utils/logHelper'
import { resend } from '../../resend'
import { revalidateTag } from 'next/cache'
import { denied, requireAdmin } from '@/app/lib/auth/guards'
import { canCreateAccount } from '@/app/lib/auth/permissions'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** New accounts are always plain admins: this action can never hand out a higher role. */
export async function createAdminUser(email: string, firstName: string, lastName: string) {
  const gate = await requireAdmin()
  if (gate.ok === false) return denied(gate)

  const verdict = canCreateAccount({ id: gate.userId, role: gate.role })
  if (verdict.allowed === false) return { success: false, error: verdict.reason }

  if (!email?.trim()) return { success: false, error: 'Email is required' }
  if (!firstName?.trim()) return { success: false, error: 'First name is required' }
  if (!lastName?.trim()) return { success: false, error: 'Last name is required' }
  if (!EMAIL.test(email.trim())) return { success: false, error: 'Enter a valid email address' }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  // emails are stored lowercase, so look for the lowercase form or a different capitalisation slips through
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } }).catch(() => null)
  if (existing) return { success: false, error: 'A user with this email already exists' }

  const user = await prisma.user
    .create({
      data: {
        email: email.toLowerCase().trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: 'ADMIN'
      }
    })
    .catch(() => null)

  if (!user) {
    await createLog('error', await buildLogMessage(`failed to create admin user "${email}"`, actor, context), {
      email,
      firstName,
      lastName,
      createdBy: actor,
      request: context
    }).catch(() => null)

    return { success: false, error: 'Failed to create user' }
  }

  await createLog(
    'info',
    await buildLogMessage(`created admin user "${user.firstName} ${user.lastName}" (${user.email})`, actor, context),
    {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdBy: actor,
      request: context
    }
  ).catch(() => null)

  const { error } = await resend.emails.send({
    from: 'The Pops Orchestra <noreply@thepopsorchestra.org>',
    to: email,
    bcc: ['sqysh@sqysh.io'],
    // bcc: ['robyn@thepopsorchestra.org', 'sqysh@sqysh.io'],
    subject: 'You have been added as an admin — The Pops Orchestra',
    html: adminWelcomeTemplate(firstName.trim(), email.trim())
  })

  if (error) {
    await createLog('error', await buildLogMessage(`failed to send welcome email to new admin "${email}"`, actor, context), {
      userId: user.id,
      email,
      createdBy: actor,
      request: context
    }).catch(() => null)

    return { success: true, emailFailed: true }
  }

  revalidateTag('dashboard', 'default')

  return { success: true, emailFailed: false }
}
