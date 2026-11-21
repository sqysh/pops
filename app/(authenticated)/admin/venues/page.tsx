import { getVenues } from '@/app/lib/actions/venue/getVenues'
import { VenuesClient } from './VenuesClient'
import { requireStaffPage } from '@/app/lib/auth/guards'

export default async function VenuesPage() {
  await requireStaffPage()

  const result = await getVenues()
  return <VenuesClient venues={result} />
}
