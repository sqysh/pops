import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/navigation'

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
  subscriptionsLive: boolean,
  content: unknown = []
): NavigationLinksProps[] => {
  const { t } = pageCopy(content, pageContent)
  return [
    { linkKey: '/', textKey: t('nav_home'), active: path === '/' },
    ...(subscriptionsLive
      ? [{ linkKey: '/subscriptions', textKey: t('nav_subscriptions'), active: path === '/subscriptions' }]
      : []),
    ...(concertsPageLive
      ? [
          {
            textKey: t('nav_concerts'),
            linkKey: '/concerts',
            active: path.includes('/concerts')
          }
        ]
      : []),
    {
      linkKey: '/sundays-at-neel',
      textKey: t('nav_sundays_at_neel'),
      active: path === '/sundays-at-neel'
    },
    // {
    //   linkKey: '/bubbles-bash',
    //   textKey: 'Golden Bubbles Bash',
    //   active: path === '/bubbles-bash'
    // },
    {
      isButton: true,
      textKey: t('nav_education'),
      active: ['/student-performers', '/student-scholarships', '/camp-application'].includes(path),
      links: [
        {
          textKey: t('nav_education_student_performers'),
          linkKey: '/student-performers',
          active: path === '/student-performers'
        },
        {
          textKey: t('nav_education_student_scholarships'),
          linkKey: '/student-scholarships',
          active: path === '/student-scholarships'
        },
        // Show camping application if admin and feature toggle is visible, OR if feature toggle is live
        ...(campApplicationsSetting
          ? [
              {
                textKey: t('nav_education_camp_application'),
                linkKey: '/camp-application',
                active: path === '/camp-application'
              }
            ]
          : [])
      ]
    },
    {
      textKey: t('nav_venues'),
      linkKey: '/venues',
      active: path.includes('/venues')
    },
    {
      isButton: true,
      textKey: t('nav_about'),
      active: ['/about', '/robyn-bell', '/board-members', '/staff', '/musicians'].includes(path),
      links: [
        {
          textKey: t('nav_about_orchestra'),
          linkKey: '/about',
          active: path === '/about'
        },
        {
          textKey: t('nav_about_robyn_bell'),
          linkKey: '/robyn-bell',
          active: path === '/robyn-bell'
        },
        {
          textKey: t('nav_about_board_members'),
          linkKey: '/board-members',
          active: path === '/board-members'
        },
        {
          textKey: t('nav_about_staff'),
          linkKey: '/staff',
          active: path === '/staff'
        },
        {
          textKey: t('nav_about_musicians'),
          linkKey: '/musicians',
          active: path === '/musicians'
        }
      ]
    },
    {
      isButton: true,
      textKey: t('nav_support'),
      active: ['/donate', '/advertise-with-us', '/sponsorship-opportunities'].includes(path),
      links: [
        {
          textKey: t('nav_support_donate'),
          linkKey: '/donate',
          active: path === '/donate'
        },
        {
          linkKey: '/advertise-with-us',
          textKey: t('nav_support_advertise'),
          active: path === '/advertise-with-us'
        },
        {
          linkKey: '/sponsorship-opportunities',
          textKey: t('nav_support_sponsorship'),
          active: path === '/sponsorship-opportunities'
        }
      ]
    },
    {
      isButton: true,
      textKey: t('nav_more'),
      active: ['/contact', '/subscribe', '/media'].includes(path),
      links: [
        { linkKey: '/contact', textKey: t('nav_more_contact'), active: path === '/contact' },
        { linkKey: '/subscribe', textKey: t('nav_more_subscribe'), active: path === '/subscribe' },
        { linkKey: '/media', textKey: t('nav_more_media'), active: path === '/media' }
      ]
    }
  ]
}

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
