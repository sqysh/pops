'use server'

import { createLog } from '@/app/utils/logHelper'
import { parseStack } from 'error-stack-parser-es/lite'

export async function getMailchimpMembers() {
  const API_KEY = process.env.MAILCHIMP_API_KEY!
  const LIST_ID = process.env.MAILCHIMP_LIST_ID!

  if (!API_KEY || !LIST_ID) return { success: false, error: 'Mailchimp environment variables are not configured' }

  const DATACENTER = API_KEY.split('-')[1]
  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members?count=100&offset=0&sort_field=timestamp_opt&sort_dir=DESC`
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `apikey ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    }).catch(async (error: any) => {
      await createLog('error', `Failed to fetch Mailchimp subscribers: ${error.message}`, {
        errorMessage: error.message,
        errorName: error.name || 'UnknownError',
        timestamp: new Date().toISOString()
      }).catch(() => null)

      return null
    })

    if (!response) return { success: false, error: 'Failed to fetch subscribers' }

    if (!response.ok) {
      const errorResponse = await response.json()

      await createLog('error', `Mailchimp API request failed: ${errorResponse.title}`, {
        errorLocation: parseStack(JSON.stringify(errorResponse)),
        errorMessage: errorResponse.detail,
        errorName: errorResponse.title,
        timestamp: new Date().toISOString()
      }).catch(() => null)

      return { success: false, error: `Mailchimp API Error: ${response.statusText}` }
    }

    const data = await response.json()

    const members = data.members.map((member: any) => ({
      email: member.email_address,
      status: member.status,
      name: member.full_name,
      phoneNumber: member.merge_fields.MMERGE3,
      address: member.merge_fields.MMERGE4,
      interests: {
        isOption1: member.interests['05e5e5fd1e'],
        isOption2: member.interests['23e4855071'],
        isOption3: member.interests['f02e8752c1'],
        isOption4: member.interests['4d63e535d9'],
        isNewPatron: member.interests['21dd6933b9'],
        agreedToPrivacyStatement: member.interests['2b3f9c51d8']
      },
      stats: {
        avgOpenRate: member.stats.avg_open_rate,
        avgClickRate: member.stats.avg_click_rate
      },
      createdAt: member.timestamp_opt,
      contactId: member.contact_id,
      ipOpt: member.ip_opt
    }))

    return { success: true, data: { members, totalItems: data.total_items } }
  } catch (error: any) {
    await createLog('error', `Failed to fetch Mailchimp subscribers: ${error.message}`, {
      errorMessage: error.message,
      errorName: error.name || 'UnknownError',
      timestamp: new Date().toISOString()
    }).catch(() => null)

    return { success: false, error: 'Failed to fetch subscribers' }
  }
}
