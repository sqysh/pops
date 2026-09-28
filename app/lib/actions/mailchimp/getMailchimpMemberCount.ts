'use server'

import { createLog } from '@/app/utils/logHelper'

export async function getMailchimpMemberCount(): Promise<{ success: boolean; count: number | null }> {
  const API_KEY = process.env.MAILCHIMP_API_KEY
  const LIST_ID = process.env.MAILCHIMP_LIST_ID

  if (!API_KEY || !LIST_ID) return { success: false, count: null }

  const DATACENTER = API_KEY.split('-')[1]

  const response = await fetch(`https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members?count=1&offset=0`, {
    headers: {
      Authorization: `apikey ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  }).catch(() => null)

  if (!response?.ok) {
    await createLog('error', `Mailchimp member count unavailable${response ? ` (${response.status})` : ''}`, {
      status: response?.status ?? null
    }).catch(() => null)

    return { success: false, count: null }
  }

  const data = await response.json().catch(() => null)

  if (typeof data?.total_items !== 'number') return { success: false, count: null }

  return { success: true, count: data.total_items }
}
