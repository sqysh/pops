import prisma from '@/prisma/client'
import SubscriptionsClient from './SubscriptionsClient'

export default async function SubscriptionsPage() {
  const result = await prisma.siteSetting.findUnique({ where: { key: 'subscriptionsLive' } }).catch(() => null)
  return <SubscriptionsClient subscriptionsLive={result.value} />
}
