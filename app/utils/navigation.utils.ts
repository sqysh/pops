export interface NavigationLinksProps {
  textKey: string
  linkKey?: string
  active?: boolean
  isButton?: boolean
  links?: { linkKey: string; textKey: string; active?: boolean; isExternal?: boolean }[]
}

export const getNavigationLinks = (
  path: string,
  concertsPageLive: boolean,
  campApplicationsSetting: boolean,
  subscriptionsLive: boolean
): NavigationLinksProps[] => [
  { linkKey: '/', textKey: 'Home', active: path === '/' },
  ...(subscriptionsLive
    ? [{ linkKey: '/subscriptions', textKey: 'Subscriptions', active: path === '/subscriptions' }]
    : []),
  ...(concertsPageLive
    ? [
        {
          textKey: 'Concerts',
          linkKey: '/concerts',
          active: path.includes('/concerts')
        }
      ]
    : []),
  // {
  //   linkKey: '/sundays-at-neel',
  //   textKey: 'Sundays@Neel',
  //   active: path === '/sundays-at-neel'
  // },
  // {
  //   linkKey: '/bubble-bash',
  //   textKey: 'Golden Bubbles Bash',
  //   active: path === '/bubble-bash'
  // },
  {
    isButton: true,
    textKey: 'Education',
    active: ['/student-performers', '/student-scholarships', '/camp-application'].includes(path),
    links: [
      {
        textKey: 'Student Performers',
        linkKey: '/student-performers',
        active: path === '/student-performers'
      },
      {
        textKey: 'Student Scholarships',
        linkKey: '/student-scholarships',
        active: path === '/student-scholarships'
      },
      // Show camping application if admin and feature toggle is visible, OR if feature toggle is live
      ...(campApplicationsSetting
        ? [
            {
              textKey: 'Camping With The Pops',
              linkKey: '/camp-application',
              active: path === '/camp-application'
            }
          ]
        : [])
    ]
  },
  {
    textKey: 'Venues',
    linkKey: '/venues',
    active: path.includes('/venues')
  },
  {
    isButton: true,
    textKey: 'About',
    active: ['/about', '/robyn-bell', '/board-members', '/staff', '/musicians'].includes(path),
    links: [
      {
        textKey: 'The Pops Orchestra',
        linkKey: '/about',
        active: path === '/about'
      },
      {
        textKey: 'Robyn Bell',
        linkKey: '/robyn-bell',
        active: path === '/robyn-bell'
      },
      {
        textKey: 'Board members',
        linkKey: '/board-members',
        active: path === '/board-members'
      },
      {
        textKey: 'Staff',
        linkKey: '/staff',
        active: path === '/staff'
      },
      {
        textKey: 'Musicians',
        linkKey: '/musicians',
        active: path === '/musicians'
      }
    ]
  },
  {
    isButton: true,
    textKey: 'Support',
    active: ['/donate', '/advertise-with-us', '/sponsorship-opportunities'].includes(path),
    links: [
      {
        textKey: 'Donate',
        linkKey: '/donate',
        active: path === '/donate'
      },
      { linkKey: '/advertise-with-us', textKey: 'Advertise With Us', active: path === '/advertise-with-us' },
      {
        linkKey: '/sponsorship-opportunities',
        textKey: 'Sponsorship Opportunities',
        active: path === '/sponsorship-opportunities'
      }
    ]
  },
  {
    isButton: true,
    textKey: 'More',
    active: ['/contact', '/subscribe', '/media'].includes(path),
    links: [
      { linkKey: '/contact', textKey: 'Contact', active: path === '/contact' },
      { linkKey: '/subscribe', textKey: 'Subscribe to our Newsletter', active: path === '/subscribe' },
      { linkKey: '/media', textKey: 'Media', active: path === '/media' }
    ]
  }
]

export const getFooterLinks = (path: string) => {
  const navItems = [
    { linkKey: '/contact', textKey: 'Contact' },
    { linkKey: '/privacy-policy', textKey: 'Privacy Policy' },
    { linkKey: '/accessibility', textKey: 'Accessibility' }
  ]

  return navItems.map(({ linkKey, textKey }) => ({
    linkKey,
    textKey,
    active: path === linkKey
  }))
}
