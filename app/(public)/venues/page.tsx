import { getVenues } from '@/app/lib/actions/venue/getVenues'
import { VenuesClient } from './VenuesClient'

export const dynamic = 'force-dynamic'

export default async function VenuesLayout() {
  const venues = await getVenues()
  return <VenuesClient venues={venues} />
}
