import { getSponsors } from '@/app/lib/actions/sponsor/getSponsors'
import { SponsorsClient } from './SponsorsClient'
import { requireStaffPage } from '@/app/lib/auth/guards'

export default async function SponsorsPage() {
  await requireStaffPage()

  const result = await getSponsors()
  return <SponsorsClient sponsors={result.data} />
}
