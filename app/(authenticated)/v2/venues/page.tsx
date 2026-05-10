import { getVenues } from '@/app/lib/actions/venue/getVenues'
import { VenuesClient } from './VenuesClient'

export default async function VenuesPage() {
  const result = await getVenues()
  return <VenuesClient venues={result} />
}
