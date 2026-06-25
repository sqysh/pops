import { getSubscriptions } from '@/app/lib/actions/subscription/getSubscriptions'
import { SubscriptionsClient } from './SubscriptionsClient'

export default async function SubscriptionsPage() {
  const result = await getSubscriptions()
  const subscriptions = result.success && result.data ? result.data : []

  return <SubscriptionsClient subscriptions={subscriptions} />
}
