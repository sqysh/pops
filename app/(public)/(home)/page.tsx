import { HomeClient } from '@/app/(public)/(home)/HomeClient'
import { getHomePageData } from '@/app/lib/actions/getHomePageData'

export default async function HomePage() {
  const data = await getHomePageData()

  return <HomeClient {...data} />
}
