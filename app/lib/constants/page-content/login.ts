export const pageContent = {
  slug: 'login',
  content: [
    { id: 'login_loading', type: 'text', label: 'Text shown while the page loads', value: 'Loading…', section: 'Loading' },
    { id: 'login_logo_text', type: 'text', label: 'Name at the top', value: 'The Pops Orchestra', section: 'Heading' },
    { id: 'login_badge', type: 'text', label: 'Small label above the heading', value: 'Staff only', section: 'Heading' },
    { id: 'login_heading', type: 'text', label: 'Heading', value: 'Sign In', section: 'Heading' },
    {
      id: 'login_intro',
      type: 'textarea',
      label: 'Text under the heading',
      value:
        'Admin portal for Pops Orchestra staff. Sign in with your approved account to manage concerts, subscriptions, and site content.',
      section: 'Heading'
    },
    {
      id: 'login_google_button',
      type: 'text',
      label: 'Google sign in button text',
      value: 'Continue with Google',
      section: 'Sign In Button'
    },
    {
      id: 'login_google_loading',
      type: 'text',
      label: 'Google sign in button text while signing in',
      value: 'Signing in...',
      section: 'Sign In Button'
    },
    {
      id: 'login_help_text',
      type: 'textarea',
      label: 'Help text under the button ({email} is where the copyable contact email appears)',
      value: 'Access is limited to approved accounts. Need access or having trouble? Email {email}.',
      section: 'Help'
    },
    {
      id: 'login_back_link',
      type: 'text',
      label: 'Back to the website link text',
      value: 'Back to thepopsorchestra.org',
      section: 'Bottom of Page'
    },
    { id: 'login_admin_tag', type: 'text', label: 'Small label at the bottom right', value: 'Admin', section: 'Bottom of Page' },
    {
      id: 'login_logo_label',
      type: 'text',
      label: 'Name link label for screen readers',
      value: 'The Pops Orchestra — return to homepage',
      section: 'Screen Reader Text'
    },
    {
      id: 'login_google_label',
      type: 'text',
      label: 'Google sign in button label for screen readers',
      value: 'Sign in with Google',
      section: 'Screen Reader Text'
    },
    {
      id: 'login_google_loading_label',
      type: 'text',
      label: 'Google sign in button label for screen readers while signing in',
      value: 'Signing in, please wait',
      section: 'Screen Reader Text'
    },
    {
      id: 'login_google_loading_hint',
      type: 'text',
      label: 'Extra text for screen readers while signing in',
      value: 'Please wait',
      section: 'Screen Reader Text'
    },
    {
      id: 'login_copy_email_hint',
      type: 'text',
      label: 'Text read after the contact email for screen readers',
      value: '(click to copy)',
      section: 'Screen Reader Text'
    },
    {
      id: 'login_copy_email_copied',
      type: 'text',
      label: 'Text read after the contact email once it is copied, for screen readers',
      value: '(copied to clipboard)',
      section: 'Screen Reader Text'
    }
  ]
}
