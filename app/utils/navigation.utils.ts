export interface NavigationLinksProps {
  textKey: string
  linkKey?: string
  active?: boolean
  isButton?: boolean
  links?: { linkKey: string; textKey: string; active?: boolean; isExternal?: boolean }[]
}

export const getNavigationLinks = (
  path: string,
  thereAreConcerts: boolean,
  campApplicationsSetting: boolean
): NavigationLinksProps[] => [
  { linkKey: '/', textKey: 'Home', active: path === '/' },
  // ...(thereAreConcerts
  //   ? [
  //       {
  //         textKey: 'Concerts',
  //         linkKey: '/concerts',

  //         active: path.includes('/concerts')
  //       }
  //     ]
  //   : []),
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
      },
      {
        textKey: 'Hidden Gems',
        linkKey: '/hidden-gems',
        active: path === '/hidden-gems'
      }
    ]
  },
  { linkKey: '/support', textKey: 'Support', active: path === '/support' },
  ,
  {
    isButton: true,
    textKey: 'More',
    active: ['/advertise-with-us', '/sponsorship-opportunities', '/contact', '/connect-with-us', '/media'].includes(
      path
    ),
    links: [
      { linkKey: '/advertise-with-us', textKey: 'Advertise With Us', active: path === '/advertise-with-us' },
      {
        linkKey: '/sponsorship-opportunities',
        textKey: 'Sponsorship Opportunities',
        active: path === '/sponsorship-opportunities'
      },
      { linkKey: '/contact', textKey: 'Contact', active: path === '/contact' },
      { linkKey: '/connect-with-us', textKey: 'Connect With Us', active: path === '/connect-with-us' },
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
