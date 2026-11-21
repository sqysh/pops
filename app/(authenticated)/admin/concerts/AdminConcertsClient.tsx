'use client'

import { ConcertsBoard } from './_components/ConcertsBoard'

export function AdminConcertsClient({ concerts, instances }) {
  return <ConcertsBoard concerts={concerts} instances={instances} />
}
