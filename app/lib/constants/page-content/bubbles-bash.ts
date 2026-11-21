export const pageContent = {
  slug: 'bubbles-bash',
  content: [
    {
      id: 'bash_staff_dashboard',
      type: 'text',
      label: 'Dashboard button text (only shown to signed-in staff)',
      value: 'Dashboard',
      section: 'Top Bar'
    },
    {
      id: 'bash_title',
      type: 'text',
      label: 'Event name (hero and details heading)',
      value: 'Bubbles Bash 2027',
      section: 'Event Details'
    },
    {
      id: 'bash_date',
      type: 'text',
      label: 'Event date',
      value: 'Saturday, January 30, 2027',
      section: 'Event Details'
    },
    {
      id: 'bash_time',
      type: 'text',
      label: 'Event time',
      value: '5:00 – 8:00 p.m.',
      section: 'Event Details'
    },
    {
      id: 'bash_scroll_label',
      type: 'text',
      label: 'Scroll down prompt at the bottom of the hero',
      value: 'Scroll Down',
      section: 'Event Details'
    },
    {
      id: 'bash_description',
      type: 'array',
      label: 'Event description (one paragraph per line)',
      value: [
        'Join The Pops Orchestra of Bradenton & Sarasota for Bubbles Bash 2027, an unforgettable evening of celebration, music, entertainment, and opportunity! This special sit-down fundraising dinner invites our patrons, donors, and friends into the Pops Living Room for an intimate evening filled with wonderful company, delightful surprises, and the music that brings us together.',
        "Celebrate The Pops Orchestra's impact and help support its future as we continue sharing the joy of music throughout our community!"
      ],
      section: 'Event Details'
    },
    {
      id: 'bash_venue_name',
      type: 'text',
      label: 'Venue name',
      value: 'The Graham',
      section: 'Venue'
    },
    {
      id: 'bash_venue_address',
      type: 'text',
      label: 'Venue address (links to Google Maps)',
      value: '3650 17th Street, Sarasota, FL 34235',
      section: 'Venue'
    },
    {
      id: 'bash_tickets_heading',
      type: 'text',
      label: 'Tickets heading',
      value: 'Tickets',
      section: 'Tickets'
    },
    {
      id: 'bash_single_label',
      type: 'text',
      label: 'Single ticket name',
      value: 'Single Ticket',
      section: 'Tickets'
    },
    {
      id: 'bash_single_price',
      type: 'text',
      label: 'Single ticket price',
      value: '$125',
      section: 'Tickets'
    },
    {
      id: 'bash_table_label',
      type: 'text',
      label: 'Table name',
      value: 'Table for 8',
      section: 'Tickets'
    },
    {
      id: 'bash_table_price',
      type: 'text',
      label: 'Table price',
      value: '$1,200',
      section: 'Tickets'
    },
    {
      id: 'bash_table_note',
      type: 'text',
      label: 'Table note, e.g. added table perks (leave blank to hide)',
      value: '',
      section: 'Tickets',
      optional: true
    },
    {
      id: 'bash_valet',
      type: 'text',
      label: 'Valet parking line',
      value: 'Valet parking available for $10',
      section: 'Tickets'
    },
    {
      id: 'bash_ticket_button',
      type: 'text',
      label: 'Ticket button text',
      value: 'Get Tickets',
      section: 'Tickets'
    },
    {
      id: 'bash_ticket_url',
      type: 'text',
      label: 'Ticket link: the public CueBox purchase link, starting with https:// (the button is hidden while this is blank)',
      value: '',
      section: 'Tickets',
      optional: true,
      url: true
    },
    {
      id: 'bash_closing',
      type: 'text',
      label: 'Closing line',
      value: "We can't wait to celebrate with you!",
      section: 'Tickets'
    },
    {
      id: 'bash_footer_copyright',
      type: 'text',
      label: 'Copyright line ({year} is the current year)',
      value: '© {year} The Pops Orchestra of Bradenton and Sarasota. All rights reserved.',
      section: 'Footer'
    },
    {
      id: 'bash_logo_alt',
      type: 'text',
      label: 'Logo description (alt text)',
      value: 'The Pops Orchestra of Sarasota and Bradenton',
      section: 'Image Descriptions'
    },
    {
      id: 'bash_sr_home_link',
      type: 'text',
      label: 'Logo link label for screen readers',
      value: 'The Pops Orchestra of Sarasota and Bradenton — return to homepage',
      section: 'Screen Reader Text'
    },
    {
      id: 'bash_sr_heading',
      type: 'text',
      label: 'Page heading for screen readers ({title} is the event name)',
      value: 'The Pops Orchestra {title}',
      section: 'Screen Reader Text'
    },
    {
      id: 'bash_sr_scroll_button',
      type: 'text',
      label: 'Scroll down button label for screen readers',
      value: 'Scroll down to content',
      section: 'Screen Reader Text'
    },
    {
      id: 'bash_sr_map_link',
      type: 'text',
      label: 'Map link label for screen readers ({address} is the venue address)',
      value: '{address} — open in Google Maps (opens in new tab)',
      section: 'Screen Reader Text'
    },
    {
      id: 'bash_sr_new_tab',
      type: 'text',
      label: 'Ticket button note for screen readers',
      value: '(opens in new tab)',
      section: 'Screen Reader Text'
    }
  ]
}
