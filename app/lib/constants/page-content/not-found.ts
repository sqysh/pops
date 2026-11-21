export const pageContent = {
  slug: 'not-found',
  content: [
    { id: 'nf_heading', type: 'text', label: 'Heading', value: 'This Page Has Left the Stage', section: 'Message' },
    {
      id: 'nf_body',
      type: 'textarea',
      label: 'Message under the heading',
      value: "The page you're looking for doesn't exist or has been moved. Let's get you back to the performance.",
      section: 'Message'
    },
    { id: 'nf_home_button', type: 'text', label: 'Home button text', value: 'Return Home', section: 'Buttons' },
    { id: 'nf_concerts_button', type: 'text', label: 'Concerts button text', value: 'View Concerts', section: 'Buttons' },
    { id: 'nf_back_button', type: 'text', label: 'Go back button text', value: 'Go Back', section: 'Buttons' },
    {
      id: 'nf_credits',
      type: 'text',
      label: 'Copyright line at the bottom ({year} is filled in automatically)',
      value: '© {year} The Pops Orchestra of Sarasota and Bradenton',
      section: 'Credits'
    }
  ]
}
