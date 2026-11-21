import { getSubscriptions } from '@/app/lib/actions/subscription'
import prisma from '@/prisma/client'
import { PageField } from '@/app/types/page.types'
import SubscriptionsClient from './SubscriptionsClient'

export const revalidate = 3600

export default async function SubscriptionsPage() {
  const [setting, subsResult, page] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: 'subscriptionsLive' } }).catch(() => null),
    getSubscriptions(),
    prisma.page.findUnique({ where: { slug: 'subscriptions' } }).catch(() => null)
  ])

  const subscriptionsLive = setting?.value ?? false
  const allSubscriptions = subsResult.success && subsResult.data ? subsResult.data : []

  // Only surface ones the admin has marked On Sale + Visible to the public
  const subscriptions = allSubscriptions.filter((s) => s.isVisible)

  const content = (page?.content as unknown as PageField[]) ?? []

  return <SubscriptionsClient subscriptionsLive={subscriptionsLive} subscriptions={subscriptions} content={content} />
}
