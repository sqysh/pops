export const pageContent = {
  slug: 'privacy-policy',
  content: [
    {
      id: 'privacy_hero_eyebrow',
      type: 'text',
      label: 'Header small line above the heading',
      value: 'The Pops Orchestra',
      section: 'Header'
    },
    { id: 'privacy_hero_heading', type: 'text', label: 'Page heading', value: 'Privacy Policy', section: 'Header' },
    {
      id: 'privacy_hero_intro',
      type: 'textarea',
      label: 'Intro paragraph under the heading',
      value:
        'At The Pops Orchestra, we keep things simple. This policy explains how we handle any information you share with us through our website.',
      section: 'Header'
    },
    { id: 'privacy_who_heading', type: 'text', label: 'Who We Are heading', value: 'Who We Are', section: 'Who We Are' },
    {
      id: 'privacy_who_body',
      type: 'textarea',
      label: 'Who We Are text ({website} and {builder} mark where the two links go)',
      value:
        "We're The Pops Orchestra of Bradenton and Sarasota, and our website is {website}. Our site was built by {builder}, who helps us maintain a secure and user-friendly experience.",
      section: 'Who We Are'
    },
    {
      id: 'privacy_who_website_link',
      type: 'text',
      label: 'Website link text',
      value: 'https://thepopsorchestra.org',
      section: 'Who We Are'
    },
    { id: 'privacy_who_builder_link', type: 'text', label: 'Website builder link text', value: 'Sqysh', section: 'Who We Are' },
    { id: 'privacy_forms_heading', type: 'text', label: 'Forms heading', value: 'When You Fill Out Our Forms', section: 'Forms' },
    {
      id: 'privacy_forms_body',
      type: 'textarea',
      label: 'Forms text',
      value:
        "We have a few contact forms on our website where you can reach out to us with questions, requests, or to get more information about our orchestra. When you fill these out, we collect basic information like your name, email address, and your message. We use this information solely to get back to you — that's it!",
      section: 'Forms'
    },
    {
      id: 'privacy_dont_heading',
      type: 'text',
      label: "What We Don't Do heading",
      value: "What We Don't Do",
      section: "What We Don't Do"
    },
    {
      id: 'privacy_dont_items',
      type: 'array',
      label: "What We Don't Do list (one item per line)",
      value: [
        "We don't sell the personal details you send us through our forms",
        "We don't send spam or unwanted emails",
        "We don't require you to create accounts or log in to browse our site"
      ],
      section: "What We Don't Do"
    },
    {
      id: 'privacy_tickets_heading',
      type: 'text',
      label: 'Tickets heading',
      value: 'Tickets & Events',
      section: 'Tickets & Events'
    },
    {
      id: 'privacy_tickets_body',
      type: 'textarea',
      label: 'Tickets text',
      value:
        "When you're ready to buy tickets for our concerts, you'll be directed to AudienceView, our ticketing partner. Any ticket purchases happen on their secure platform, not ours. Check out their privacy policy for details on how they handle your purchase information.",
      section: 'Tickets & Events'
    },
    {
      id: 'privacy_basics_heading',
      type: 'text',
      label: 'Website Basics heading',
      value: 'Website Basics',
      section: 'Website Basics'
    },
    {
      id: 'privacy_basics_body',
      type: 'textarea',
      label: 'Website Basics text',
      value:
        'Like most websites, ours automatically collects some basic information like your browser type and which pages you visit. We use cookies both to keep the site working properly (for example, remembering your preferences and making sure our forms function) and, with your consent, for the analytics and advertising tools described below.',
      section: 'Website Basics'
    },
    {
      id: 'privacy_analytics_heading',
      type: 'text',
      label: 'Analytics heading',
      value: 'Analytics & Advertising',
      section: 'Analytics & Advertising'
    },
    {
      id: 'privacy_analytics_intro',
      type: 'textarea',
      label: 'Analytics intro paragraph',
      value:
        'To understand how people use our site and to help promote our concerts, we use a few third-party tools. When you accept cookies, these tools may set their own cookies and receive information about your visit, such as the pages you view and general details about your device and browser:',
      section: 'Analytics & Advertising'
    },
    {
      id: 'privacy_analytics_ga_name',
      type: 'text',
      label: 'Tool 1 name',
      value: 'Google Analytics',
      section: 'Analytics & Advertising'
    },
    {
      id: 'privacy_analytics_ga_text',
      type: 'textarea',
      label: 'Tool 1 description ({link} marks where the privacy policy link goes)',
      value:
        'Helps us measure site traffic and understand which pages are most useful. This data is shared with Google. You can learn more in {link}.',
      section: 'Analytics & Advertising'
    },
    {
      id: 'privacy_analytics_ga_link',
      type: 'text',
      label: 'Tool 1 privacy policy link text',
      value: "Google's Privacy Policy",
      section: 'Analytics & Advertising'
    },
    {
      id: 'privacy_analytics_meta_name',
      type: 'text',
      label: 'Tool 2 name',
      value: 'Meta Pixel',
      section: 'Analytics & Advertising'
    },
    {
      id: 'privacy_analytics_meta_text',
      type: 'textarea',
      label: 'Tool 2 description ({link} marks where the privacy policy link goes)',
      value:
        'Lets us measure and promote our concerts through Facebook and Instagram. When active, it shares information about your visit with Meta, which may use it for advertising. Learn more in {link}.',
      section: 'Analytics & Advertising'
    },
    {
      id: 'privacy_analytics_meta_link',
      type: 'text',
      label: 'Tool 2 privacy policy link text',
      value: "Meta's Privacy Policy",
      section: 'Analytics & Advertising'
    },
    {
      id: 'privacy_analytics_outro',
      type: 'textarea',
      label: 'Analytics closing paragraph',
      value:
        "These tools only run if you accept cookies through the banner shown when you first visit. If you decline, they stay off. You can change your mind at any time by clearing your browser's cookies for our site, which will bring the banner back so you can choose again. Depending on where you live, you may also have the right to opt out of this kind of data sharing — just contact us using the details below and we'll help.",
      section: 'Analytics & Advertising'
    },
    { id: 'privacy_photos_heading', type: 'text', label: 'Photos heading', value: 'Photos at Our Concerts', section: 'Photos' },
    {
      id: 'privacy_photos_body',
      type: 'textarea',
      label: 'Photos text',
      value:
        "We love capturing the joy at our performances! We sometimes take photos and videos at concerts to share on our website and social media. If you'd prefer not to be included, just let our volunteers know at the event.",
      section: 'Photos'
    },
    {
      id: 'privacy_security_heading',
      type: 'text',
      label: 'Security heading',
      value: 'Keeping Things Secure',
      section: 'Security'
    },
    {
      id: 'privacy_security_body',
      type: 'textarea',
      label: 'Security text',
      value:
        'We take reasonable steps to protect any information you share with us. Our website uses secure connections, and only a few orchestra administrators have access to form submissions.',
      section: 'Security'
    },
    {
      id: 'privacy_questions_heading',
      type: 'text',
      label: 'Questions heading',
      value: 'Your Questions & Requests',
      section: 'Questions & Requests'
    },
    {
      id: 'privacy_questions_body',
      type: 'textarea',
      label: 'Questions text ({email} and {phone} mark where the two links go)',
      value:
        'If you have questions about this policy, want to know what information we have about you, or would like us to delete your contact details, just reach out! You can contact us at {email} or call us at {phone}.',
      section: 'Questions & Requests'
    },
    {
      id: 'privacy_questions_email_link',
      type: 'text',
      label: 'Email link text',
      value: 'info@thepopsorchestra.org',
      section: 'Questions & Requests'
    },
    {
      id: 'privacy_questions_phone_link',
      type: 'text',
      label: 'Phone link text',
      value: '(941) 926-POPS',
      section: 'Questions & Requests'
    },
    { id: 'privacy_updates_heading', type: 'text', label: 'Updates heading', value: 'Updates', section: 'Updates' },
    {
      id: 'privacy_updates_body',
      type: 'textarea',
      label: 'Updates text',
      value:
        "If we ever need to update this policy, we'll post the changes here. Since we keep things pretty simple, we don't expect many changes!",
      section: 'Updates'
    },
    {
      id: 'privacy_last_updated',
      type: 'text',
      label: 'Last updated line ({date} is filled in automatically with today’s date)',
      value: 'Last updated: {date}',
      section: 'Updates'
    },
    {
      id: 'privacy_sr_details_heading',
      type: 'text',
      label: 'Hidden heading above the policy sections',
      value: 'Privacy Policy Details',
      section: 'Screen Reader Text'
    },
    {
      id: 'privacy_sr_builder_link',
      type: 'text',
      label: 'Website builder link label',
      value: 'Sqysh (opens in new tab)',
      section: 'Screen Reader Text'
    },
    {
      id: 'privacy_sr_dont_list',
      type: 'text',
      label: "What We Don't Do list label",
      value: "Things we don't do with your information",
      section: 'Screen Reader Text'
    },
    {
      id: 'privacy_sr_email_link',
      type: 'text',
      label: 'Email link label',
      value: 'Email us at info@thepopsorchestra.org',
      section: 'Screen Reader Text'
    },
    {
      id: 'privacy_sr_phone_link',
      type: 'text',
      label: 'Phone link label',
      value: 'Call us at 941-926-POPS',
      section: 'Screen Reader Text'
    }
  ]
}
