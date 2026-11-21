import { ChangelogClient } from './ChangelogClient'
import { requireStaffPage } from '@/app/lib/auth/guards'

export default async function ChangeLogPage() {
  await requireStaffPage()

  return <ChangelogClient />
}
