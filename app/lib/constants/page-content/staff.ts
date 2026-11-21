export const pageContent = {
  slug: 'staff',
  content: [
    { id: 'staff_hero_home_crumb', type: 'text', label: 'Breadcrumb home link text', section: 'Hero', value: 'Home' },
    { id: 'staff_hero_breadcrumb', type: 'text', label: 'Breadcrumb page name', section: 'Hero', value: 'Staff' },
    {
      id: 'staff_hero_eyebrow',
      type: 'text',
      label: 'Hero small line above the heading',
      section: 'Hero',
      value: 'The Pops Orchestra'
    },
    { id: 'staff_hero_heading', type: 'text', label: 'Hero heading', section: 'Hero', value: 'Staff' },
    {
      id: 'staff_hero_description',
      type: 'text',
      label: 'Hero text under the heading',
      section: 'Hero',
      value: 'Meet the dedicated team behind The Pops Orchestra',
      optional: true
    },
    {
      id: 'staff_member_empty_bio',
      type: 'text',
      label: 'Profile page: message when a staff member has no biography',
      section: 'Profile Page',
      value: 'Biography coming soon'
    },
    {
      id: 'staff_member_back_label',
      type: 'text',
      label: 'Profile page: back button text',
      section: 'Profile Page',
      value: '← Back to Team'
    },
    {
      id: 'staff_sr_breadcrumb',
      type: 'text',
      label: 'Breadcrumb trail label',
      section: 'Screen Reader Text',
      value: 'Breadcrumb'
    },
    {
      id: 'staff_sr_member_list',
      type: 'text',
      label: 'Member grid label ({heading} is the hero heading)',
      section: 'Screen Reader Text',
      value: '{heading} members'
    },
    {
      id: 'staff_sr_previous',
      type: 'text',
      label: 'Profile page: previous member button label',
      section: 'Screen Reader Text',
      value: 'Previous member'
    },
    {
      id: 'staff_sr_next',
      type: 'text',
      label: 'Profile page: next member button label',
      section: 'Screen Reader Text',
      value: 'Next member'
    },
    {
      id: 'staff_sr_pagination',
      type: 'text',
      label: 'Profile page: member dots label',
      section: 'Screen Reader Text',
      value: 'Team member pagination'
    },
    {
      id: 'staff_sr_go_to',
      type: 'text',
      label: 'Profile page: member dot label ({name} is the member’s name)',
      section: 'Screen Reader Text',
      value: 'Go to {name}'
    }
  ]
}
