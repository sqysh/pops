import { getPage } from '@/app/lib/actions/page/getPage'
import DonateClient from './DonateClient'

export default async function DonatePage() {
  const page = await getPage('donate')
  return <DonateClient content={page?.content} />
}
