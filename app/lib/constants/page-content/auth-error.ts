export const pageContent = {
  slug: 'auth-error',
  content: [
    { id: 'auth_error_loading', type: 'text', label: 'Text shown while the page loads', value: 'Loading…', section: 'Loading' },
    { id: 'auth_error_logo_text', type: 'text', label: 'Name at the top', value: 'The Pops Orchestra', section: 'Heading' },
    { id: 'auth_error_eyebrow', type: 'text', label: 'Small label above the heading', value: 'All Access', section: 'Heading' },
    { id: 'auth_error_heading', type: 'text', label: 'Heading', value: 'Sign In Error', section: 'Heading' },
    {
      id: 'auth_error_intro',
      type: 'text',
      label: 'Text under the heading',
      value: 'Something interrupted the sign in process.',
      section: 'Heading'
    },
    {
      id: 'auth_error_access_denied_title',
      type: 'text',
      label: 'Account not allowed: title',
      value: 'Access Denied',
      section: 'Error Messages'
    },
    {
      id: 'auth_error_access_denied_message',
      type: 'textarea',
      label: 'Account not allowed: message',
      value: "Your account isn't authorized to access this area. Contact support if you need assistance.",
      section: 'Error Messages'
    },
    {
      id: 'auth_error_link_expired_title',
      type: 'text',
      label: 'Expired sign in link: title',
      value: 'Link Expired',
      section: 'Error Messages'
    },
    {
      id: 'auth_error_link_expired_message',
      type: 'textarea',
      label: 'Expired sign in link: message',
      value: 'That verification link has expired or already been used. Request a new one to continue.',
      section: 'Error Messages'
    },
    {
      id: 'auth_error_email_failed_title',
      type: 'text',
      label: 'Sign in email not sent: title',
      value: 'Email Failed',
      section: 'Error Messages'
    },
    {
      id: 'auth_error_email_failed_message',
      type: 'textarea',
      label: 'Sign in email not sent: message',
      value: 'The email failed to send. Double-check your email address and try again.',
      section: 'Error Messages'
    },
    {
      id: 'auth_error_cancelled_title',
      type: 'text',
      label: 'Sign in cancelled or interrupted: title',
      value: 'Sign In Cancelled',
      section: 'Error Messages'
    },
    {
      id: 'auth_error_cancelled_message',
      type: 'textarea',
      label: 'Sign in cancelled or interrupted: message',
      value: 'Looks like sign in was cancelled or interrupted. Head back and try again.',
      section: 'Error Messages'
    },
    {
      id: 'auth_error_session_required_title',
      type: 'text',
      label: 'Sign in needed first: title',
      value: 'Sign In Required',
      section: 'Error Messages'
    },
    {
      id: 'auth_error_session_required_message',
      type: 'textarea',
      label: 'Sign in needed first: message',
      value: 'You need to sign in before accessing this area.',
      section: 'Error Messages'
    },
    {
      id: 'auth_error_unknown_title',
      type: 'text',
      label: 'Any other problem: title',
      value: 'Something went wrong',
      section: 'Error Messages'
    },
    {
      id: 'auth_error_unknown_message',
      type: 'textarea',
      label: 'Any other problem: message',
      value: 'Please try again or contact support if the issue persists.',
      section: 'Error Messages'
    },
    {
      id: 'auth_error_back_to_sign_in',
      type: 'text',
      label: 'Back to sign in button text',
      value: 'Back to Sign In',
      section: 'Buttons'
    },
    { id: 'auth_error_back_home', type: 'text', label: 'Back to home button text', value: 'Back to Home', section: 'Buttons' },
    {
      id: 'auth_error_logo_label',
      type: 'text',
      label: 'Name link label for screen readers',
      value: 'The Pops Orchestra — return to homepage',
      section: 'Screen Reader Text'
    },
    {
      id: 'auth_error_actions_label',
      type: 'text',
      label: 'Button group name for screen readers',
      value: 'Recovery options',
      section: 'Screen Reader Text'
    },
    {
      id: 'auth_error_code_label',
      type: 'text',
      label: 'Text read before the error code for screen readers',
      value: 'Error code:',
      section: 'Screen Reader Text'
    }
  ]
}
