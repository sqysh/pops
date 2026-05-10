import { getSponsors } from '@/app/lib/actions/sponsor/getSponsors'
import { SponsorsClient } from './SponsorsClient'

export default async function SponsorsPage() {
  const result = await getSponsors()
  return <SponsorsClient sponsors={result.data} />
}
