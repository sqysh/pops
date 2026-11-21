export const pageContent = {
  slug: 'home',
  content: [
    // Hero
    {
      id: 'hero_heading',
      type: 'text',
      label: 'Hero heading',
      value: 'The Pops Orchestra of Bradenton and Sarasota',
      section: 'Hero'
    },
    {
      id: 'hero_subheading',
      type: 'text',
      label: 'Hero subheading',
      value: "The premier pops orchestra on Florida's Cultural Coast!",
      section: 'Hero'
    },
    { id: 'hero_btnText', type: 'text', label: 'Hero concerts button text', value: 'See Concerts', section: 'Hero' },
    {
      id: 'hero_subscriptions_button_text',
      type: 'text',
      label: 'Hero subscriptions button text',
      value: 'See Season Subscription Options',
      section: 'Hero'
    },
    { id: 'hero_scroll_text', type: 'text', label: 'Hero scroll hint text', value: 'Scroll', section: 'Hero' },

    // Season intro (the "Like No Other" block)
    { id: 'season_eyebrow', type: 'text', label: 'Season title', value: '2026–2027 Season', section: 'Season Intro' },
    {
      id: 'season_taglines',
      type: 'array',
      label: 'Season tagline lines (one per line)',
      value: ['Like No Other Orchestra.', 'Like No Other Experience.', 'Like No Other Audience.'],
      section: 'Season Intro'
    },
    {
      id: 'season_intro',
      type: 'textarea',
      label: 'Season introduction paragraph',
      value:
        "Join us for Robyn Bell's 15th season as our conductor, and a lineup of entertaining shows. We're glad you're here, and we're glad you'll hear what The Pops has in store for you.",
      section: 'Season Intro'
    },

    // Season lineup
    {
      id: 'season_lineup_heading',
      type: 'text',
      label: 'Lineup heading',
      value: "This Season's Lineup",
      section: 'Season Lineup'
    },
    {
      id: 'season_concert_1_name',
      type: 'text',
      label: 'Concert 1 name',
      value: 'Hocus Pocus Pops II',
      section: 'Season Lineup'
    },
    { id: 'season_concert_1_date', type: 'text', label: 'Concert 1 dates', value: 'October 30', section: 'Season Lineup' },
    { id: 'season_concert_2_name', type: 'text', label: 'Concert 2 name', value: 'Born in the U.S.A.', section: 'Season Lineup' },
    { id: 'season_concert_2_date', type: 'text', label: 'Concert 2 dates', value: 'November 14–16', section: 'Season Lineup' },
    {
      id: 'season_concert_3_name',
      type: 'text',
      label: 'Concert 3 name',
      value: 'Ring in the Holidays',
      section: 'Season Lineup'
    },
    { id: 'season_concert_3_date', type: 'text', label: 'Concert 3 dates', value: 'December 13–14', section: 'Season Lineup' },
    { id: 'season_concert_4_name', type: 'text', label: 'Concert 4 name', value: 'Cheek to Cheek', section: 'Season Lineup' },
    { id: 'season_concert_4_date', type: 'text', label: 'Concert 4 dates', value: 'February 13–15', section: 'Season Lineup' },
    { id: 'season_concert_5_name', type: 'text', label: 'Concert 5 name', value: "'80s Ladies", section: 'Season Lineup' },
    { id: 'season_concert_5_date', type: 'text', label: 'Concert 5 dates', value: 'March 13–15', section: 'Season Lineup' },
    {
      id: 'season_concert_6_name',
      type: 'text',
      label: 'Concert 6 name',
      value: 'How Low Can You Go?',
      section: 'Season Lineup'
    },
    { id: 'season_concert_6_date', type: 'text', label: 'Concert 6 dates', value: 'April 11–12', section: 'Season Lineup' },

    // Tickets on sale
    {
      id: 'season_onsale_eyebrow',
      type: 'text',
      label: 'On-sale small title above the heading',
      value: 'Mark Your Calendar',
      section: 'Tickets On Sale'
    },
    {
      id: 'season_onsale_heading',
      type: 'text',
      label: 'On-sale heading',
      value: 'Tickets Go On Sale',
      section: 'Tickets On Sale'
    },
    { id: 'season_onsale_1_date', type: 'text', label: 'On-sale row 1 date', value: 'May 13', section: 'Tickets On Sale' },
    {
      id: 'season_onsale_1_label',
      type: 'text',
      label: 'On-sale row 1 name',
      value: 'Season Renewals',
      section: 'Tickets On Sale'
    },
    { id: 'season_onsale_2_date', type: 'text', label: 'On-sale row 2 date', value: 'June 22', section: 'Tickets On Sale' },
    {
      id: 'season_onsale_2_label',
      type: 'text',
      label: 'On-sale row 2 name (links to subscriptions)',
      value: 'New Season Subscriptions',
      section: 'Tickets On Sale'
    },
    { id: 'season_onsale_3_date', type: 'text', label: 'On-sale row 3 date', value: 'August 3', section: 'Tickets On Sale' },
    {
      id: 'season_onsale_3_label',
      type: 'text',
      label: 'On-sale row 3 name',
      value: 'Individual & Flex Packages',
      section: 'Tickets On Sale'
    },

    // Get in touch
    {
      id: 'question_eyebrow',
      type: 'text',
      label: 'Get in touch small title above the heading',
      value: 'Get In Touch',
      section: 'Get In Touch'
    },
    { id: 'question_heading', type: 'text', label: 'Get in touch heading', value: 'Have A Question?!', section: 'Get In Touch' },
    {
      id: 'question_subheading',
      type: 'textarea',
      label: 'Get in touch paragraph',
      value: "We'd love to hear from you!  Fill out the contact form below and we will get back to you soon.",
      section: 'Get In Touch'
    },
    { id: 'question_email_title', type: 'text', label: 'Email card title', value: 'Email Us', section: 'Get In Touch' },
    {
      id: 'question_email_description',
      type: 'text',
      label: 'Email card description',
      value: 'Get in touch via email',
      section: 'Get In Touch'
    },
    {
      id: 'question_email_detail',
      type: 'text',
      label: 'Email card address shown',
      value: 'info@popsorchestra.org',
      section: 'Get In Touch'
    },
    {
      id: 'question_email_href',
      type: 'text',
      label: 'Email card link (mailto:)',
      value: 'mailto:info@popsorchestra.org',
      section: 'Get In Touch'
    },
    { id: 'question_phone_title', type: 'text', label: 'Phone card title', value: 'Call Us', section: 'Get In Touch' },
    {
      id: 'question_phone_description',
      type: 'text',
      label: 'Phone card description',
      value: 'Mon-Fri 9AM-5PM EST',
      section: 'Get In Touch'
    },
    {
      id: 'question_phone_detail',
      type: 'text',
      label: 'Phone card number shown',
      value: '941-926-7677 (POPS)',
      section: 'Get In Touch'
    },
    {
      id: 'question_phone_href',
      type: 'text',
      label: 'Phone card link (tel:)',
      value: 'tel:941-926-7677',
      section: 'Get In Touch'
    },
    { id: 'question_address_title', type: 'text', label: 'Address card title', value: 'Visit Us', section: 'Get In Touch' },
    {
      id: 'question_address_description',
      type: 'text',
      label: 'Address card description',
      value: 'Come see us in person',
      section: 'Get In Touch'
    },
    {
      id: 'question_address_detail',
      type: 'textarea',
      label: 'Address card address shown',
      value: '502 3rd Ave W\nBradenton, FL 34205',
      section: 'Get In Touch'
    },
    {
      id: 'question_address_href',
      type: 'text',
      label: 'Address card map link',
      value: 'https://maps.google.com/?q=502+3rd+Ave+W+Bradenton+FL+34205',
      section: 'Get In Touch'
    },
    { id: 'question_buttonText', type: 'text', label: 'Contact button text', value: 'Contact Us', section: 'Get In Touch' },

    // Sponsors
    {
      id: 'sponsors_eyebrow',
      type: 'text',
      label: 'Sponsors small title above the heading',
      value: 'Our Partners',
      section: 'Sponsors'
    },
    { id: 'sponsors_heading', type: 'text', label: 'Sponsors heading', value: 'Our Sponsors!', section: 'Sponsors' },
    {
      id: 'sponsors_subheading',
      type: 'text',
      label: 'Sponsors paragraph',
      value: 'Thank you to our generous sponsors who support our mission',
      section: 'Sponsors'
    },

    // Newsletter
    {
      id: 'contact_eyebrow',
      type: 'text',
      label: 'Newsletter small title above the heading',
      value: 'Stay Connected',
      section: 'Newsletter'
    },
    { id: 'contact_heading', type: 'text', label: 'Newsletter heading', value: 'Keep up to date', section: 'Newsletter' },
    {
      id: 'contact_subheading',
      type: 'text',
      label: 'Newsletter paragraph',
      value: 'Keep up to date on Pops concerts, news announcements, and special offers.',
      section: 'Newsletter'
    },
    { id: 'contact_buttonText', type: 'text', label: 'Newsletter button text', value: 'Sign me up', section: 'Newsletter' },
    { id: 'contact_buttonHref', type: 'text', label: 'Newsletter button link', value: '/connect-with-us', section: 'Newsletter' },
    {
      id: 'contact_note',
      type: 'text',
      label: 'Newsletter note under the button',
      value: 'No spam, ever.',
      section: 'Newsletter'
    },

    // Testimonials
    {
      id: 'testimonials_eyebrow',
      type: 'text',
      label: 'Testimonials small title above the heading',
      value: 'Testimonials',
      section: 'Testimonials'
    },
    { id: 'testimonials_heading', type: 'text', label: 'Testimonials heading', value: 'What They Say', section: 'Testimonials' },
    {
      id: 'testimonials_count',
      type: 'text',
      label: 'Testimonial counter ({current} and {total} are filled in)',
      value: '{current} / {total}',
      section: 'Testimonials'
    },

    // Events
    { id: 'events_eyebrow', type: 'text', label: 'Events small title above the heading', value: 'Calendar', section: 'Events' },
    { id: 'events_heading', type: 'text', label: 'Events heading', value: 'Upcoming Events', section: 'Events' },
    { id: 'events_all_link_text', type: 'text', label: 'All events link text', value: 'All Events', section: 'Events' },

    // News
    { id: 'news_eyebrow', type: 'text', label: 'News small title above the heading', value: 'Latest', section: 'News' },
    { id: 'news_heading', type: 'text', label: 'News heading', value: 'News', section: 'News' },
    { id: 'news_all_link_text', type: 'text', label: 'All news link text', value: 'All News', section: 'News' },
    {
      id: 'news_image_placeholder',
      type: 'text',
      label: 'Text shown when the featured article has no image',
      value: 'The Pops Orchestra',
      section: 'News'
    },
    { id: 'news_read_more', type: 'text', label: 'Featured article read more text', value: 'Read More', section: 'News' },

    // Image descriptions
    {
      id: 'hero_logo_alt',
      type: 'text',
      label: 'Hero logo description (alt text)',
      value: 'The Pops Orchestra of Sarasota and Bradenton',
      section: 'Image Descriptions'
    },
    {
      id: 'season_title_image_alt',
      type: 'text',
      label: 'Season "Like No Other" title image description (alt text)',
      value: 'Like No Other',
      section: 'Image Descriptions'
    },

    // Screen reader text
    {
      id: 'hero_section_label',
      type: 'text',
      label: 'Hero section label for screen readers',
      value: 'Hero: The Pops Orchestra of Sarasota and Bradenton',
      section: 'Screen Reader Text'
    },
    {
      id: 'hero_logo_link_label',
      type: 'text',
      label: 'Hero logo link label for screen readers',
      value: 'The Pops Orchestra of Sarasota and Bradenton — return to homepage',
      section: 'Screen Reader Text'
    },
    {
      id: 'hero_concerts_link_label',
      type: 'text',
      label: 'Hero concerts button label for screen readers',
      value: 'See concerts',
      section: 'Screen Reader Text'
    },
    {
      id: 'hero_subscriptions_link_label',
      type: 'text',
      label: 'Hero subscriptions button label for screen readers',
      value: 'See season subscription options',
      section: 'Screen Reader Text'
    },
    {
      id: 'season_concert_link_label',
      type: 'text',
      label: 'Lineup concert link label for screen readers ({name} is the concert name)',
      value: 'View {name}',
      section: 'Screen Reader Text'
    },
    {
      id: 'question_methods_label',
      type: 'text',
      label: 'Contact cards list label for screen readers',
      value: 'Contact methods',
      section: 'Screen Reader Text'
    },
    {
      id: 'question_method_link_label',
      type: 'text',
      label: 'Contact card link label for screen readers ({title} and {detail} come from the card)',
      value: '{title}: {detail}',
      section: 'Screen Reader Text'
    },
    {
      id: 'question_button_link_label',
      type: 'text',
      label: 'Contact button label for screen readers ({button} is the button text)',
      value: '{button} — visit our contact page',
      section: 'Screen Reader Text'
    },
    {
      id: 'sponsors_list_label',
      type: 'text',
      label: 'Sponsor list label for screen readers',
      value: 'All sponsors',
      section: 'Screen Reader Text'
    },
    {
      id: 'contact_button_link_label',
      type: 'text',
      label: 'Newsletter button label for screen readers ({button} is the button text)',
      value: '{button} — sign up for our newsletter',
      section: 'Screen Reader Text'
    },
    {
      id: 'testimonials_carousel_label',
      type: 'text',
      label: 'Testimonials carousel label for screen readers',
      value: 'Testimonials carousel',
      section: 'Screen Reader Text'
    },
    {
      id: 'testimonials_carousel_role',
      type: 'text',
      label: 'Testimonials carousel type announced by screen readers',
      value: 'carousel',
      section: 'Screen Reader Text'
    },
    {
      id: 'testimonials_previous_label',
      type: 'text',
      label: 'Previous testimonial button label for screen readers',
      value: 'Previous testimonial',
      section: 'Screen Reader Text'
    },
    {
      id: 'testimonials_next_label',
      type: 'text',
      label: 'Next testimonial button label for screen readers',
      value: 'Next testimonial',
      section: 'Screen Reader Text'
    },
    {
      id: 'testimonials_indicators_label',
      type: 'text',
      label: 'Testimonial dots label for screen readers',
      value: 'Testimonial indicators',
      section: 'Screen Reader Text'
    },
    {
      id: 'testimonials_dot_label',
      type: 'text',
      label: 'Testimonial dot label for screen readers ({number} is filled in)',
      value: 'Go to testimonial {number}',
      section: 'Screen Reader Text'
    },
    {
      id: 'events_all_link_label',
      type: 'text',
      label: 'All events link label for screen readers',
      value: 'View all upcoming events',
      section: 'Screen Reader Text'
    },
    {
      id: 'news_all_link_label',
      type: 'text',
      label: 'All news link label for screen readers',
      value: 'View all news articles',
      section: 'Screen Reader Text'
    }
  ]
}
