import { getSubscriptions } from '@/app/lib/actions/subscription/getSubscriptions'
import { SubscriptionsClient } from './SubscriptionsClient'
import { requireStaffPage } from '@/app/lib/auth/guards'

export default async function SubscriptionsPage() {
  await requireStaffPage()

  const result = await getSubscriptions()
  const subscriptions = result.success && result.data ? result.data : []

  return <SubscriptionsClient subscriptions={subscriptions} />
}
