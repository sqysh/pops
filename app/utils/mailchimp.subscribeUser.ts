import { createLog } from './logHelper'
import { formatPhoneNumberForMailchimp } from './phone.utils'

export const subscribeUser = async (
  interestMapping: Record<string, boolean>,
  API_KEY: string,
  DATACENTER: string,
  LIST_ID: string,
  address: { addr1?: string; city?: string; state?: string; zip?: string },
  user: { firstName?: string; lastName?: string; email: string; phoneNumber?: string }
) => {
  const mergeFields: Record<string, any> = {
    FNAME: user?.firstName || '',
    LNAME: user?.lastName || '',
    EMAIL: user?.email
  }

  if (user?.phoneNumber) {
    mergeFields.MMERGE3 = formatPhoneNumberForMailchimp(user.phoneNumber)
  }

  if (address?.addr1) {
    mergeFields.MMERGE4 = {
      addr1: address?.addr1 || '',
      city: address?.city || '',
      state: address?.state || '',
      zip: address?.zip || '',
      country: 'US'
    }
  }

  const subscribeResponse = await fetch(`https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`, {
    method: 'POST',
    headers: {
      Authorization: `apikey ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email_address: user?.email,
      status: 'subscribed',
      merge_fields: mergeFields,
      interests: interestMapping
    })
  })

  const subscribeResult = await subscribeResponse.json()

  if (!subscribeResponse.ok) {
    await createLog('error', `Mailchimp subscribe failed: ${subscribeResult.title}`, {
      errorMessage: subscribeResult.detail,
      errorName: subscribeResult.title,
      timestamp: new Date().toISOString()
    }).catch(() => null)

    return {
      success: false,
      error: subscribeResult.title,
      detail: subscribeResult.detail,
      errors: subscribeResult.errors
    }
  }

  await createLog('info', 'User successfully subscribed to Mailchimp', {
    message: `Subscribed email: ${user?.email}`,
    timestamp: new Date().toISOString()
  }).catch(() => null)

  return { success: true }
}
