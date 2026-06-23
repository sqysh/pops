import { HomeClient } from './components/pages/HomeClient'
import { getHomePageData } from './lib/actions/getHomePageData'

export default async function HomePage() {
  const data = await getHomePageData()

  return <HomeClient {...data} />
}
