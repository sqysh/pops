import { getPage } from '@/app/lib/actions/page/getPage'
import { SubscribeClient } from '@/app/(public)/subscribe/SubscribeClient'

export default async function SubscribePage() {
  const data = await getPage('subscribe')
  return <SubscribeClient data={data} />
}
