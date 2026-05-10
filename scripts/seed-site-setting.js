import prisma from '../prisma/client.ts'

async function seedSiteSetting() {
  await prisma.siteSetting.createMany({
    data: [
      {
        key: 'subscriptionsLive',
        name: 'Season Subscriptions',
        description: 'Shows subscription button on the concerts page',
        value: true
      },
      {
        key: 'concertsPageLive',
        name: 'Public Concerts Page',
        description: 'Makes /concerts accessible to everyone',
        value: false
      },
      {
        key: 'ticketsLive',
        name: 'Individual Tickets & Flex',
        description: 'Shows individual + flex ticket purchase options',
        value: false
      }
    ],
    skipDuplicates: true
  })
}

seedSiteSetting()
