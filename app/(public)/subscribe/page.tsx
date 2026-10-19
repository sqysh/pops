import { getPage } from '@/app/lib/actions/page/getPage'
import { NewsletterClient } from '@/app/(public)/subscribe/NewsletterClient'

export default async function NewsletterPage() {
  const data = await getPage('subscribe')
  return <NewsletterClient data={data} />
}
