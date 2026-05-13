import { getPage } from '@/app/lib/actions/page/getPage'
import { SupportClient } from './SupportClient'

export default async function SupportPage() {
  const data = await getPage('chair-sponsorships')
  return <SupportClient data={data} />
}
