export const pageContent = {
  slug: 'venues',
  content: [
    { id: 'venues_hero_home_crumb', type: 'text', label: 'Breadcrumb home link text', section: 'Hero', value: 'Home' },
    { id: 'venues_hero_breadcrumb', type: 'text', label: 'Breadcrumb page name', section: 'Hero', value: 'Venues' },
    {
      id: 'venues_hero_eyebrow',
      type: 'text',
      label: 'Hero small line above the heading',
      section: 'Hero',
      value: 'The Pops Orchestra'
    },
    { id: 'venues_hero_heading', type: 'text', label: 'Hero heading', section: 'Hero', value: 'Venues' },
    {
      id: 'venues_hero_description',
      type: 'textarea',
      label: 'Hero text under the heading',
      section: 'Hero',
      value:
        'Where the music happens. Get directions, parking, and seating details for each of the venues hosting our 2026–27 season.',
      optional: true
    },
    {
      id: 'venues_capacity',
      type: 'text',
      label: 'Seat count over the venue photo ({capacity} is the number of seats)',
      section: 'Venue Details',
      value: '{capacity} seats'
    },
    {
      id: 'venues_detail_accessibility',
      type: 'text',
      label: 'Accessibility label',
      section: 'Venue Details',
      value: 'Accessibility'
    },
    {
      id: 'venues_detail_immersive',
      type: 'text',
      label: 'Immersive environment label',
      section: 'Venue Details',
      value: 'Immersive Environment'
    },
    { id: 'venues_detail_parking', type: 'text', label: 'Parking label', section: 'Venue Details', value: 'Parking' },
    { id: 'venues_detail_address', type: 'text', label: 'Address label', section: 'Venue Details', value: 'Address' },
    {
      id: 'venues_seating_heading',
      type: 'text',
      label: 'Seating chart heading',
      section: 'Seating Chart',
      value: 'Seating Chart'
    },
    {
      id: 'venues_riverview_floor',
      type: 'text',
      label: 'Riverview: first floor map heading',
      section: 'Seating Chart',
      value: 'First Floor'
    },
    {
      id: 'venues_riverview_balcony',
      type: 'text',
      label: 'Riverview: balcony map heading',
      section: 'Seating Chart',
      value: 'Balcony'
    },
    { id: 'venues_neel_first', type: 'text', label: 'Neel: first map heading', section: 'Seating Chart', value: 'First Half' },
    { id: 'venues_neel_second', type: 'text', label: 'Neel: second map heading', section: 'Seating Chart', value: 'Second Half' },
    {
      id: 'venues_opera_mezz',
      type: 'text',
      label: 'Opera House: mezzanine map heading',
      section: 'Seating Chart',
      value: 'Mezzanine & Balcony'
    },
    {
      id: 'venues_opera_main',
      type: 'text',
      label: 'Opera House: main floor map heading',
      section: 'Seating Chart',
      value: 'Main Floor'
    },
    { id: 'venues_parrish_main', type: 'text', label: 'Parrish: map heading', section: 'Seating Chart', value: 'Main Floor' },
    {
      id: 'venues_seat_info_empty',
      type: 'text',
      label: 'Message under a map before a seat is chosen',
      section: 'Seating Chart',
      value: 'Tap a seat to see details'
    },
    { id: 'venues_seat_info_level', type: 'text', label: 'Chosen seat: level label', section: 'Seating Chart', value: 'Level' },
    { id: 'venues_seat_info_seat', type: 'text', label: 'Chosen seat: seat label', section: 'Seating Chart', value: 'Seat' },
    { id: 'venues_seat_info_price', type: 'text', label: 'Chosen seat: price label', section: 'Seating Chart', value: 'Price' },
    {
      id: 'venues_seatmap_opera_eyebrow',
      type: 'text',
      label: 'Opera House maps: small line above the map title',
      section: 'Seat Maps',
      value: 'Sarasota Opera House'
    },
    {
      id: 'venues_seatmap_opera_mezz_heading',
      type: 'text',
      label: 'Opera House mezzanine map title',
      section: 'Seat Maps',
      value: 'Seatmap'
    },
    {
      id: 'venues_seatmap_opera_main_heading',
      type: 'text',
      label: 'Opera House main floor map title',
      section: 'Seat Maps',
      value: 'Main Floor'
    },
    {
      id: 'venues_seatmap_parrish_eyebrow',
      type: 'text',
      label: 'Parrish map: small line above the map title',
      section: 'Seat Maps',
      value: 'Parrish High School'
    },
    { id: 'venues_seatmap_parrish_heading', type: 'text', label: 'Parrish map title', section: 'Seat Maps', value: 'Seatmap' },
    {
      id: 'venues_seatmap_parrish_count',
      type: 'text',
      label: 'Parrish map seat total ({count} is the number of seats)',
      section: 'Seat Maps',
      value: '{count} seats'
    },
    {
      id: 'venues_seatmap_tier_general',
      type: 'text',
      label: 'Map key: general pricing',
      section: 'Seat Maps',
      value: 'General pricing'
    },
    {
      id: 'venues_seatmap_tier_premium',
      type: 'text',
      label: 'Map key: premium pricing',
      section: 'Seat Maps',
      value: 'Premium pricing'
    },
    {
      id: 'venues_seatmap_tier_ultra',
      type: 'text',
      label: 'Map key: ultra pricing',
      section: 'Seat Maps',
      value: 'Ultra pricing'
    },
    {
      id: 'venues_seatmap_tier_wheelchair',
      type: 'text',
      label: 'Map key: accessible seating',
      section: 'Seat Maps',
      value: 'Accessible seating'
    },
    {
      id: 'venues_seatmap_tooltip',
      type: 'text',
      label: 'Seat pop-up ({row} and {seat} are filled in)',
      section: 'Seat Maps',
      value: 'Row {row} · Seat {seat}'
    },
    {
      id: 'venues_seatmap_box',
      type: 'text',
      label: 'Opera House box name in the seat pop-up ({box} is the box number)',
      section: 'Seat Maps',
      value: 'Box {box}'
    },
    {
      id: 'venues_image_alt',
      type: 'text',
      label: 'Venue photo description ({name} is the venue name)',
      section: 'Image Descriptions',
      value: '{name} performance hall'
    },
    {
      id: 'venues_sr_breadcrumb',
      type: 'text',
      label: 'Breadcrumb trail label',
      section: 'Screen Reader Text',
      value: 'Breadcrumb'
    },
    { id: 'venues_sr_list', type: 'text', label: 'Venue list label', section: 'Screen Reader Text', value: 'Performance venues' },
    {
      id: 'venues_sr_seat',
      type: 'text',
      label: 'Parrish map seat label ({row}, {seat} and {tier} are filled in)',
      section: 'Screen Reader Text',
      value: 'Row {row}, seat {seat}, {tier}'
    }
  ]
}
