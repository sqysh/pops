import { auth } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import SubscriptionsFlexClient from './SubscriptionsFlexClient'

export default async function SubscriptionsFlexTestPage() {
  const session = await auth()
  const role = session?.user?.role

  if (role !== 'ADMIN' && role !== 'CONDUCTOR' && role !== 'SUPER_USER') {
    redirect('/v2/dashboard')
  }

  return <SubscriptionsFlexClient />
}
