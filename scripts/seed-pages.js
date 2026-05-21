import { footerPageData } from '../app/lib/constants/pages/footer.constants.ts'
import prisma from '../prisma/client.ts'

async function seedPages() {
  console.log('Seeding pages...')

  for (const page of footerPageData) {
    await prisma.page.update({
      where: { slug: page.slug },
      data: { content: page.content }
    })
    console.log(`✓ ${page.slug}`)
  }
}

seedPages()
