import { getPage } from '@/app/lib/actions/page/getPage'
import { getVenues } from '@/app/lib/actions/venue/getVenues'
import { VenuesClient } from './VenuesClient'

export const dynamic = 'force-dynamic'

export default async function VenuesLayout() {
  const [venues, page] = await Promise.all([getVenues(), getPage('venues')])
  return <VenuesClient venues={venues} content={page?.content} />
}
