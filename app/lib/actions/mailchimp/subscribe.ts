'use server'

import z from 'zod'
import crypto from 'crypto'
import { createLog } from '@/app/utils/logHelper'
import getInterestsMapping from '@/app/utils/mailchimp.getInterestsMapping'
import { subscribeUser } from '@/app/utils/mailchimp.subscribeUser'
import { ActionResult } from '@/app/action.types'
import { NewsletterFormInput, newsletterSchema } from '@/app/lib/schemas/newsletter.schema'

const MIN_FILL_MS = 2000

const INTEREST_IDS = ['05e5e5fd1e', '23e4855071', 'f02e8752c1', '4d63e535d9']
const PRIVACY_INTEREST_ID = '21dd6933b9'
const NEW_PATRON_INTEREST_ID = '2b3f9c51d8'

export async function subscribeToMailchimp(data: NewsletterFormInput): Promise<ActionResult<null>> {
  const parsed = newsletterSchema.safeParse(data)

  if (!parsed.success) {
    return {
      success: false,
      error: 'Please check the highlighted fields and try again.',
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      data: null
    }
  }

  const {
    email,
    firstName,
    lastName,
    phoneNumber,
    addr1,
    city,
    state,
    zip,
    isOption1,
    isOption2,
    isOption3,
    isOption4,
    isNewPatron,
    agreedToPrivacyStatement,
    renderedAt
  } = parsed.data

  // nobody fills in a name, address and interests inside two seconds, so report
  // success without writing anything and let the bot leave
  if (Date.now() - renderedAt < MIN_FILL_MS) {
    return { success: true, data: null }
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY
  const LIST_ID = process.env.MAILCHIMP_LIST_ID

  if (!API_KEY || !LIST_ID) {
    await createLog('error', 'Mailchimp subscribe attempted with missing environment variables', {
      hasApiKey: !!API_KEY,
      hasListId: !!LIST_ID
    }).catch(() => null)

    return { success: false, error: 'The mailing list is not available right now.', data: null }
  }

  const DATACENTER = API_KEY.split('-')[1]
  const BASE_URL = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}`

  const hash = crypto.createHash('md5').update(email).digest('hex')

  const lookup = await fetch(`${BASE_URL}/members/${hash}`, {
    method: 'GET',
    headers: {
      Authorization: `apikey ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  }).catch(() => null)

  if (!lookup) {
    return { success: false, error: 'We could not reach the mailing list. Please try again in a moment.', data: null }
  }

  const lookupBody = await lookup.json().catch(() => null)

  if (lookup.ok) {
    return {
      success: false,
      error: 'That email address is already on the list.',
      data: null,
      fieldErrors: { email: ['That email address is already on the list.'] }
    }
  }

  const permanentlyDeleted = lookup.status === 400 && lookupBody?.detail?.includes('permanently deleted')

  // 404 means no such member, which is the happy path for a new subscriber
  if (lookup.status !== 404 && !permanentlyDeleted) {
    await createLog('error', `Mailchimp member lookup failed with ${lookup.status}`, {
      status: lookup.status,
      detail: lookupBody?.detail ?? null
    }).catch(() => null)

    return { success: false, error: 'We could not reach the mailing list. Please try again in a moment.', data: null }
  }

  const user = { firstName, lastName, email, phoneNumber }
  const address = { addr1, city, state, zip }

  const interestMapping = await getInterestsMapping(
    isOption1,
    isOption2,
    isOption3,
    isOption4,
    agreedToPrivacyStatement,
    isNewPatron,
    INTEREST_IDS,
    PRIVACY_INTEREST_ID,
    NEW_PATRON_INTEREST_ID
  )

  const subscribeResult = await subscribeUser(interestMapping, API_KEY, DATACENTER, LIST_ID, address, user).catch(
    async (error: unknown) => {
      const err = error instanceof Error ? error : new Error(String(error))

      await createLog('error', `Subscribing to Mailchimp failed: ${err.message}`, {
        errorStack: err.stack ?? null,
        errorMessage: err.message,
        errorName: err.name,
        email,
        timestamp: new Date().toISOString()
      }).catch(() => null)

      return null
    }
  )

  if (!subscribeResult) {
    return { success: false, error: 'We could not add you to the list just then. Please try again.', data: null }
  }

  await createLog('info', `new newsletter subscriber "${firstName} ${lastName}"`, {
    email,
    isNewPatron,
    interests: [isOption1, isOption2, isOption3, isOption4]
  }).catch(() => null)

  return { success: true, data: null }
}
